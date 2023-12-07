import { Controller, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('message')
export class MessageController {
  @MessagePattern('FROM_EMAIL')
  async testEvent(@Payload('data') data: string) {
    console.log('MESSAGE CALLED');
    return `MESSAGE,${data}`;
  }

  @MessagePattern('FROM_AUTH')
  async testAuth(@Payload('data') data: string) {
    console.log('MESSAGE CALLED');
    return `MESSAGE,${data}`;
  }
}
