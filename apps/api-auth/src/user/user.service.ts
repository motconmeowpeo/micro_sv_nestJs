import { Injectable } from '@nestjs/common';
import {
  ICreateUserDto,
  ISignInDto,
} from '../../../../libs/core/models/user.model';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpCommand } from './commands/sign-up/sign-up.command';
import { SignInQuery } from './queries/sign-in/sign-in.query';
import { IVerifyCodeDto } from '../../../../libs/core/models/user.model';
import { VerifyCodeQuery } from './queries/verify-code/verify-code.query';
import { GetAllUserHandle } from './queries';
import { GetAllUserQuery } from './queries/get-all-user/get-all-user.query';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  signUp(createUserDto: ICreateUserDto): Promise<boolean> {
    return this.commandBus.execute<SignUpCommand>(
      new SignUpCommand(createUserDto),
    );
  }

  signIn(signInDto: ISignInDto) {
    return this.queryBus.execute<SignInQuery>(new SignInQuery(signInDto));
  }

  verifyCode(payload: IVerifyCodeDto) {
    return this.queryBus.execute<VerifyCodeQuery>(new VerifyCodeQuery(payload));
  }

  getAll() {
    return this.queryBus.execute<GetAllUserQuery>(new GetAllUserQuery());
  }
}
