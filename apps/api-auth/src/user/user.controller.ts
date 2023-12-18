import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ICreateUserDto,
  ISignInDto,
} from '../../../../libs/core/models/user.model';
import { Public } from 'libs/core/decorators/public.decorator';
import { IVerifyCodeDto } from 'libs/core/models/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('sign-up')
  async create(@Body() createUserDto: ICreateUserDto) {
    const value = await this.userService.signUp(createUserDto);
    return value;
  }

  @Public()
  @Post('sign-in')
  findAll(@Body() signInDto: ISignInDto) {
    return this.userService.signIn(signInDto);
  }

  @Public()
  @Post('verify')
  verifyCode(@Body() payload: IVerifyCodeDto) {
    return this.userService.verifyCode(payload);
  }

  @Public()
  @Get('get-all')
  getAll() {
    return this.userService.getAll();
  }
}
