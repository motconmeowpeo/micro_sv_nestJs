import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SendCodeModule } from './send-code/send-code.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SendCodeModule, ConfigModule.forRoot()],
})
export class ApiEmailModule {}
