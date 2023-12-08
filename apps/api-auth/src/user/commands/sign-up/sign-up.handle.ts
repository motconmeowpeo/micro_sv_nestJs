import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from './sign-up.command';
import { Observable, from, lastValueFrom, map, of, switchMap, tap } from 'rxjs';
import { UserRepository } from '../../user.repository';
import {
  BadRequestException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ICreateUserDto } from 'libs/core/models/user.model';
import { genSalt, hash, compare as _compare } from 'bcryptjs';
import { Role, User } from '@prisma/client';
import { CacheService } from '../../../../../../libs/core/cache/cache.service';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_SEND_CODE } from 'libs/core/constants/message.constant';

@CommandHandler(SignUpCommand)
export class SignUpHandle implements ICommandHandler {
  constructor(
    private repository: UserRepository,
    private cacheService: CacheService,
    @Inject('EMAIL_SERVICE') private emailClient: ClientProxy,
  ) {}
  execute({ payload }: SignUpCommand): Promise<boolean> {
    const stream = this.validateEmail(payload.email).pipe(
      switchMap((isExisted) => {
        if (isExisted) {
          throw new BadRequestException({
            code: 'EMAIL_ALREADY_EXISTED',
            message: 'Email already existed',
          });
        }
        return this.generateCode(payload.email, payload);
      }),
      switchMap((code) => {
        return this.sendCode(code, payload.email);
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

  private codeGenerator(length: number): string {
    return Array.from({ length }, () =>
      (Math.floor(Math.random() * 9) + 0).toString(),
    ).join('');
  }

  private generateCode(
    email: string,
    payload: ICreateUserDto,
  ): Observable<string> {
    return from(this.cacheService.get(email)).pipe(
      switchMap((code) => {
        console.log(code);
        if (code) {
          throw new BadRequestException({
            code: 'MANY_REQUEST',
            message: 'Your should request each 5 minute',
          });
        }
        const codeGenerator = this.codeGenerator(+process.env.CODE_LENGTH);
        this.cacheService.set(email, codeGenerator, +process.env.TTL);
        this.cacheService.set(
          `${codeGenerator}`,
          JSON.stringify(payload),
          +process.env.TTL,
        );

        return of(codeGenerator);
      }),
    );
  }

  private sendCode(code: string, email: string) {
    return this.emailClient
      .send<boolean>(MESSAGE_SEND_CODE, { code, email })
      .pipe(map((value) => value));
  }
}
