import { Role } from '../enum/user.enum';

export interface ICreateUserDto {
  email: string;
  username: string;
  password: string;
  avatar?: string;
  role?: Role;
}

export interface ISignInDto {
  email: string;
  password: string;
}

export interface IVerifyCodeDto {
  email: string;
  code: string;
}

export interface AuthUser {
  accessToken: string;
}
