import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessageModule } from './message/message.module';

@Module({
  imports: [MessageModule],
})
export class ApiMessageModule {}
