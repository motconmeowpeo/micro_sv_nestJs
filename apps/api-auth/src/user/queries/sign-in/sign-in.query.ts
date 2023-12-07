import { ISignInDto } from 'libs/core/models/user.model';

export class SignInQuery {
  constructor(public readonly payload: ISignInDto) {}
}
