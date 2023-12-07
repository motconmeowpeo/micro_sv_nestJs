import { Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { from, lastValueFrom, map, of, switchMap, tap } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('EMAIL_SERVICE') private emailClient: ClientProxy,
    @Inject('EMAIL_SERVICE') private messageClient: ClientProxy,
  ) {}

  @Post('test')
  async test1() {
    console.log('AUTH_CALLED');
    return this.emailClient.send('FROM_AUTH', { data: 'AUTH' }).pipe(
      tap((value) => {
        console.log('VALUE FROM EMAIL:', value);
      }),
    );
  }

  @MessagePattern('FROM_EMAIL')
  async testEvent(@Payload('data') data: string) {
    console.log('AUTH CALLED');
    return this.messageClient
      .send('FROM_AUTH', {
        data: `AUTH,${data}`,
      })
      .pipe(
        tap((value) => {
          console.log('Value from MESSAGE:', value);
        }),
      );
  }
}
