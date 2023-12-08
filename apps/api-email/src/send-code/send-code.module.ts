import { Module } from '@nestjs/common';
import { SendCodeService } from './send-code.service';
import { SendCodeController } from './send-code.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SendGridService } from 'libs/core/send-grid/send-grid.service';

@Module({
  providers: [SendCodeService, SendGridService],
  controllers: [SendCodeController],
})
export class SendCodeModule {}
