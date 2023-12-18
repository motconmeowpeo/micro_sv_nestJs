import { GetAllUserHandle } from './get-all-user';
import { SignInHandle } from './sign-in';
import { VerifyCodeHandle } from './verify-code';

export const QUERIES = [SignInHandle, VerifyCodeHandle, GetAllUserHandle];

export * from './sign-in';
export * from './verify-code';
export * from './get-all-user';
