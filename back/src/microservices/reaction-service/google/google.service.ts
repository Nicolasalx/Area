import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';

@Injectable()
export class GoogleReactionService {
  async manageReactionGoogle(
    refreshToken: string,
    reaction: string,
    data: any,
  ): Promise<string> {
    switch (reaction.toLowerCase()) {
      case 'send_email':
        return this.sendEmail(refreshToken, data);
      case 'set_calendar_event':
        return this.setCalendarEvent(refreshToken, data);
      case 'create_youtube_playlist':
        return this.createYoutubePlaylist(refreshToken, data);
      default:
        return 'Action not recognized for Google';
    }
  }

  private async createYoutubePlaylist(
    refreshToken: string,
    data: {
      title: string;
      description?: string;
      privacyStatus: string;
    },
  ): Promise<string> {
    const { title, description, privacyStatus } = data;
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

    try {
      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI,
      );
      oAuth2Client.setCredentials({ refresh_token: refreshToken });

      const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });

      const requestBody = {
        snippet: {
          title: title,
          description: description || '',
        },
        status: {
          privacyStatus: privacyStatus,
        },
      };

      const response = await youtube.playlists.insert({
        part: ['snippet', 'status'],
        requestBody: requestBody,
      });

      const { data } = response;
      console.log('Playlist created successfully:', data);
      return `Playlist created successfully with ID: ${data.id}`;
    } catch (error) {
      console.error('Error creating YouTube playlist:', error);
      return 'Error creating YouTube playlist!';
    }
  }

  private async setCalendarEvent(
    refreshToken: string,
    data: {
      calendarId: string;
      summary: string;
      description?: string;
      location?: string;
      startDateTime: string;
      endDateTime: string;
      attendees?: { email: string }[];
    },
  ): Promise<string> {
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

    try {
      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI,
      );
      oAuth2Client.setCredentials({ refresh_token: refreshToken });

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

  private async sendEmail(
    refreshToken: string,
    data: {
      from: string;
      to: string;
      subject: string;
      text: string;
      html: string;
    },
  ): Promise<string> {
    const { from, to, subject, text, html } = data;
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

    try {
      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI,
      );
      oAuth2Client.setCredentials({ refresh_token: refreshToken });

      const accessToken = await oAuth2Client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: from,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: refreshToken,
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
