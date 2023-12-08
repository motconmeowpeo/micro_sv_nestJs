import { CommandHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CacheService } from 'libs/core/cache/cache.service';
import { from, lastValueFrom, map, of, switchMap, tap } from 'rxjs';
import { VerifyCodeQuery } from './verify-code.query';
import { ICreateUserDto } from 'libs/core/models/user.model';
import { Role, User } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';
import { UserRepository } from '../../user.repository';
import { BadRequestException } from '@nestjs/common';

@QueryHandler(VerifyCodeQuery)
export class VerifyCodeHandle implements IQueryHandler {
  constructor(
    private cacheService: CacheService,
    private repository: UserRepository,
  ) {}

  execute({ payload }: VerifyCodeQuery): Promise<User> {
    return lastValueFrom(
      this.verifyCode(payload.code, payload.email).pipe(
        switchMap((isVerify) => {
          if (!isVerify) {
            throw new BadRequestException({
              code: 'INVALID_CODE',
              message: 'Invalid code',
            });
          }
          return this.cacheService.get(`${payload.code}`);
        }),
        switchMap((userPayload) => {
          const user: ICreateUserDto = JSON.parse(userPayload);
          return this.createUser(user);
        }),
      ),
    );
  }

  private verifyCode(code: string, email: string) {
    return from(this.cacheService.get(email)).pipe(
      map((cacheCode) => cacheCode === code),
      tap((isValid) => {
        if (isValid) {
          this.cacheService.del(email);
        }
      }),
    );
  }

  private async createUser(payload: ICreateUserDto): Promise<User> {
    const { email, username, password, role, avatar } = payload;
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);
    return this.repository.user.create({
      data: {
        email,
        password: passwordHash,
        username,
        avatar: avatar ?? undefined,
        role: role === Role.ADMIN ? Role.ADMIN : Role.USER,
      },
    });
  }
}
