import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [MessagesModule],
})
export class ApiMessageModule {}
