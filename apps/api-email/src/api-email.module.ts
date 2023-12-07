import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailModule } from './email/email.module';

@Module({
  imports: [EmailModule],
})
export class ApiEmailModule {}
