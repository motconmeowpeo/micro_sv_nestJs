import { IVerifyCodeDto } from 'libs/core/models/user.model';

export class VerifyCodeQuery {
  constructor(public payload: IVerifyCodeDto) {}
}
