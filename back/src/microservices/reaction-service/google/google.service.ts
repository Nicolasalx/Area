import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';

@Injectable()
export class GoogleService {
  async handleAction(action: string, data: any): Promise<string> {
    switch (action.toLowerCase()) {
      case 'send_email':
        return this.sendEmail(data);
      default:
        return 'Action not recognized for Google';
    }
  }

  private async sendEmail(data: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<string> {
    const { from, to, subject, text, html } = data;
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
    const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

    try {
      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI,
      );
      oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

      const accessToken = await oAuth2Client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: from,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken.token || '',
        },
      });

      const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result);
      return 'Mail sent successfully (simulated via Google service)';
    } catch (error) {
      console.error('Error during sending of the mail :', error);
      return 'Error during sending of the mail!';
    }
  }
}
