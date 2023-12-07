import { IQuery, IQueryBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SignInQuery } from './sign-in.query';
import { Observable, from, lastValueFrom, map, of, switchMap, tap } from 'rxjs';
import { compare } from 'bcryptjs';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../user.repository';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from 'libs/core/models/user.model';

@QueryHandler(SignInQuery)
export class SignInHandle implements IQueryHandler {
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  execute({ payload }: SignInQuery): Promise<AuthUser> {
    const stream = this.validatePassword(payload.email, payload.password).pipe(
      switchMap((user) => this.validateActiveUser(user)),
      switchMap((user) => this.signToken(user)),
    );
    return lastValueFrom(stream);
  }

  private validateActiveUser(user: User): Observable<User> {
    if (!user.active) {
      throw new BadRequestException({
        code: 'USER_INACTIVE',
        message: 'User inactive',
      });
    }
    return of(user);
  }

  private validatePassword(email: string, password: string): Observable<User> {
    return from(
      this.repository.user.findUnique({
        where: { email },
      }),
    ).pipe(
      switchMap((user) => {
        if (!user) {
          throw new BadRequestException({
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          });
        }
        return from(compare(password, user.password)).pipe(
          map((isValid) => {
            if (!isValid) {
              throw new UnauthorizedException();
            }
            return user;
          }),
        );
      }),
    );
  }

  private signToken(user: User): Observable<AuthUser> {
    const { id, email, role } = user || {};
    const payload = {
      id,
      email,
      role,
    };

    return of({
      accessToken: this.jwtService.sign(payload, { subject: user.id }),
    });
  }
}
