import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from './sign-up.command';
import { Observable, from, lastValueFrom, map, of, switchMap } from 'rxjs';
import { UserRepository } from '../../user.repository';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ICreateUserDto } from 'libs/core/models/user.model';
import { genSalt, hash, compare as _compare } from 'bcryptjs';
import { Role, User } from '@prisma/client';

@CommandHandler(SignUpCommand)
export class SignUpHandle implements ICommandHandler {
  constructor(private repository: UserRepository) {}
  execute({ payload }: SignUpCommand): Promise<User> {
    const stream = this.validateEmail(payload.email).pipe(
      switchMap((isExisted) => {
        if (isExisted) {
          throw new BadRequestException({
            code: 'EMAIL_ALREADY_EXISTED',
            message: 'Email already existed',
          });
        }
        return from(this.createUser(payload));
      }),
    );
    return lastValueFrom(stream);
  }

  private validateEmail(email: string): Observable<boolean> {
    return from(
      this.repository.user.findUnique({
        where: {
          email,
        },
      }),
    ).pipe(
      map((user) => {
        if (user) {
          return true;
        }
        return false;
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
