import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SendGridService } from 'libs/core/send-grid/send-grid.service';

@Injectable()
export class SendCodeService {
  constructor(private sendGrid: SendGridService) {}

  sendCode(code: string, email: string) {
    const subject = 'YOUR VERIFY CODE';
    const content = `Thanks for your action. Your verify code : ${code}`;
    return this.sendGrid.sendEmail(email, subject, content);
  }
}
