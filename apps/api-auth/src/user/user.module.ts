import { Module, ModuleMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { COMMANDS } from './commands';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepository } from './user.repository';
import { QUERIES } from './queries';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CacheModule } from 'libs/core/cache/cache.module';

const MODULE: ModuleMetadata = {
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.REDIS,
        options: {
          port: 6379,
        },
      },
      {
        name: 'MESSAGE_SERVICE',
        transport: Transport.REDIS,
        options: {
          port: 6379,
        },
      },
    ]),
    CacheModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...COMMANDS, ...QUERIES],
};

@Module({ ...MODULE })
export class UserModule {}
