import { Injectable } from '@nestjs/common';
import { IReactionHandler } from '@reaction-service/handler/base.handler';
import axios from 'axios';

@Injectable()
export class TwilioReactionService implements IReactionHandler {
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly twilioPhoneNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  canHandle(service: string): boolean {
    return service === 'twilio';
  }

  async handle(reaction: string, data: any): Promise<string> {
    switch (reaction.toLowerCase()) {
      case 'send_sms':
        return this.sendSms(data);
      case 'send_mms':
        return this.sendMms(data);
      default:
        return 'Reaction not recognized for Twilio';
    }
  }

  private async sendSms(data: { message: string }): Promise<string> {
    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
        new URLSearchParams({
          From: this.twilioPhoneNumber,
          To: '+33783119455',
          Body: data.message,
        }),
        {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
        },
      );

      if (response.status === 201) {
        return 'Message sent successfully';
      } else {
        return `Error: ${response.statusText}`;
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      return 'Failed to send SMS';
    }
  }

  private async sendMms(data: {
    message: string;
    img_url: string;
  }): Promise<string> {
    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
        new URLSearchParams({
          From: this.twilioPhoneNumber,
          To: '+33783119455',
          Body: data.message,
          MediaUrl: data.img_url,
        }),
        {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
        },
      );

      if (response.status === 201) {
        return 'MMS sent successfully';
      } else {
        return `Error: ${response.statusText}`;
      }
    } catch (error) {
      console.error('Error sending MMS:', error);
      return 'Failed to send MMS';
    }
  }
}
