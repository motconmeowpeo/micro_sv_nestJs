import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_SEND_CODE } from 'libs/core/constants/message.constant';
import { SendCodeService } from './send-code.service';

@Controller('send-code')
export class SendCodeController {
  constructor(private sendCodeService: SendCodeService) {}
  @MessagePattern(MESSAGE_SEND_CODE)
  sendCode(@Payload('code') code: string, @Payload('email') email: string) {
    return this.sendCodeService.sendCode(code, email);
  }
}
