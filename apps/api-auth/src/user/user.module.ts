import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { COMMANDS } from './commands';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepository } from './user.repository';
import { QUERIES } from './queries';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...COMMANDS, ...QUERIES],
})
export class UserModule {}
