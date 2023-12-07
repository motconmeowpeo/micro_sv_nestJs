import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EmailService {
  //   constructor(@Inject('API_AUTH') private client: ClientProxy) {}
  test() {
    console.log('API EMAIL CALL');
    // this.client.emit('test', { data: 'This is test' });
  }
}
