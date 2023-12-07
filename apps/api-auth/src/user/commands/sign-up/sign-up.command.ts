import { ICreateUserDto } from 'libs/core/models/user.model';

export class SignUpCommand {
  constructor(public payload: ICreateUserDto) {}
}
