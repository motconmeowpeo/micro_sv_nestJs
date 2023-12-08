// sendgrid.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor() {
    sgMail.setApiKey(process.env.SEND_GRID_KEY);
    // Replace 'YOUR_SENDGRID_API_KEY' with your actual SendGrid API key
  }

  async sendEmail(
    to: string,
    subject: string,
    content: string,
  ): Promise<boolean> {
    const msg = {
      to,
      from: process.env.OWNER_EMAIL, // Replace with your verified sender email
      subject,
      text: content,
    };
    Logger.log(msg);
    try {
      await sgMail.send(msg);
      return true; // Email sent successfully
    } catch (error) {
      console.error('Error sending email:', error);
      return false; // Email failed to send
    }
  }
}
