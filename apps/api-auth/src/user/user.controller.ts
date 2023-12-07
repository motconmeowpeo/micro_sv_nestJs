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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('sign-up')
  create(@Body() createUserDto: ICreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Public()
  @Post('sign-in')
  findAll(@Body() signInDto: ISignInDto) {
    return this.userService.signIn(signInDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
