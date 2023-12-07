import { Controller, Inject, Post } from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { EmailService } from './email.service';
import { tap } from 'rxjs';

@Controller('email')
export class EmailController {
  constructor(
    @Inject('MESSAGE_SERVICE') private clientMessage: ClientProxy,
    @Inject('AUTH_SERVICE') private clientAuth: ClientProxy,
  ) {}

  @Post('email')
  async test1() {
    console.log('EMAIL_CALLED');
    return this.clientAuth.send('FROM_EMAIL', { data: 'EMAIL' }).pipe(
      tap((value) => {
        console.log('VALUE FROM AUTH:', value);
      }),
    );
  }

  @MessagePattern('FROM_AUTH')
  async testEvent(@Payload('data') data: string) {
    console.log('EMAIL CALLED');
    return this.clientMessage
      .send('FROM_EMAIL', {
        data: `EMAIL,${data}`,
      })
      .pipe(
        tap((value) => {
          console.log('Value from MESSAGE:', value);
        }),
      );
  }
}
