import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';

@Injectable()
export class GoogleService {
  async handleAction(action: string, data: any): Promise<string> {
    switch (action.toLowerCase()) {
      case 'send_email':
        return this.sendEmail(data);
      case 'set_calendar_event':
        return this.setCalendarEvent(data);
      case 'create_task':
        return this.createTask(data);
      default:
        return 'Action not recognized for Google';
    }
  }

  private async createTask(data: {
    tasklist?: string;
    title: string;
    notes?: string;
    due?: string;
  }): Promise<string> {
    const { tasklist, title, notes, due } = data;
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

      const tasks = google.tasks({ version: 'v1', auth: oAuth2Client });

      const task = {
        title,
        notes,
        due,
      };

      const response = await tasks.tasks.insert({
        tasklist: tasklist || '@default',
        requestBody: task,
      });

      console.log('Task created successfully:', response.data);
      return `Task created successfully with ID: ${response.data.id}`;
    } catch (error) {
      console.error('Error creating task:', error);
      return 'Error creating task!';
    }
  }

  private async setCalendarEvent(data: {
    calendarId: string;
    summary: string;
    description?: string;
    location?: string;
    startDateTime: string;
    endDateTime: string;
    attendees?: { email: string }[];
  }): Promise<string> {
    const {
      calendarId,
      summary,
      description,
      location,
      startDateTime,
      endDateTime,
      attendees,
    } = data;
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

      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

      const event = {
        summary,
        description,
        location,
        start: { dateTime: startDateTime, timeZone: 'UTC' },
        end: { dateTime: endDateTime, timeZone: 'UTC' },
        attendees: attendees || [],
      };

      const response = await calendar.events.insert({
        calendarId: calendarId || 'primary',
        requestBody: event,
      });

      console.log('Event created successfully:', response.data);
      return `Event created successfully with ID: ${response.data.id}`;
    } catch (error) {
      console.error('Error creating event:', error);
      return 'Error creating event!';
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
