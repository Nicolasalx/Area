import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { google } from 'googleapis';
import { ActionService } from '../action/action.service';
import { IngredientsAction } from '@common/interfaces/ingredientsAction';

@Injectable()
export class GoogleActionService {
  private lastCheckTimestamp: number = Date.now();

  constructor(private readonly actionService: ActionService) {}

  async createIngredientsAction(
    messageDetails: any,
  ): Promise<IngredientsAction[]> {
    const subjectHeader = messageDetails.data.payload.headers.find(
      (header: { name: string }) => header.name === 'Subject',
    );

    const fromHeader = messageDetails.data.payload.headers.find(
      (header: { name: string }) => header.name === 'From',
    );

    const bodyData = messageDetails.data.payload.parts?.find(
      (part: { mimeType: string }) => part.mimeType === 'text/plain',
    );
    const body = bodyData ? bodyData.body.data : '';

    const decodedBody = body
      ? Buffer.from(body, 'base64').toString('utf8')
      : '';

    const cleanedBody = decodedBody.replace(/\r?\n$/, '');

    const sender = fromHeader ? fromHeader.value : 'No sender';

    const nowInFrance = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Paris',
    });

    const franceDate = new Date(nowInFrance);

    const triggerDate = new Date(
      franceDate.getTime() - franceDate.getTimezoneOffset() * 60000,
    ).toISOString();

    const userFriendlyTriggerDate = new Date(triggerDate).toLocaleString(
      'fr-FR',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      },
    );

    return [
      { field: 'sender', value: sender },
      { field: 'subject', value: subjectHeader?.value || 'No Subject' },
      { field: 'body', value: cleanedBody },
      { field: 'trigger_date', value: userFriendlyTriggerDate },
    ];
  }

  async receiveNewEmail(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
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

      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

      const response = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:inbox',
        maxResults: 10,
      });

      const messages = response.data.messages;

      if (messages && messages.length > 0) {
        let newEmailDetected = false;

        for (const message of messages) {
          const messageDetails = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });

          const receivedDate = parseInt(
            messageDetails.data.internalDate || '0',
          );

          if (receivedDate > this.lastCheckTimestamp) {
            newEmailDetected = true;

            // Generate IngredientsAction using the helper function
            const ingredients =
              await this.createIngredientsAction(messageDetails);

            // Execute reactions based on the ingredients
            await this.actionService.executeReactionsBis(ingredients, reaction);
          }
        }

        if (newEmailDetected) {
          this.lastCheckTimestamp = Date.now();
        }
      }
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  async newCalendarEvent(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
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

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
        fields: 'items(id, summary, created)',
      });

      const events = response.data.items;

      if (events && events.length > 0) {
        let newEventDetected = false;

        for (const event of events) {
          const eventCreatedTime = new Date(event.created).getTime();

          if (eventCreatedTime > this.lastCheckTimestamp) {
            newEventDetected = true;

            console.log(
              `New Calendar Event Created: ${event.summary || 'No Title'}`,
            );

            await this.actionService.executeReactions(reaction);
          }
        }

        if (newEventDetected) {
          this.lastCheckTimestamp = Date.now();
        }
      }
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  async newTask(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
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

      const tasksApi = google.tasks({ version: 'v1', auth: oAuth2Client });

      const response = await tasksApi.tasks.list({
        tasklist: '@default',
        showCompleted: false,
        fields: 'items(id, title, updated)',
      });

      const tasks = response.data.items;

      if (tasks && tasks.length > 0) {
        let newTaskDetected = false;

        for (const task of tasks) {
          const taskUpdatedTime = new Date(task.updated).getTime();

          if (taskUpdatedTime > this.lastCheckTimestamp) {
            newTaskDetected = true;

            console.log(`New Task Detected: ${task.title || 'No Title'}`);
            await this.actionService.executeReactions(reaction);
          }
        }

        if (newTaskDetected) {
          this.lastCheckTimestamp = Date.now();
        }
      }
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  async newPlaylistYoutube(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
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

      const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });

      const response = await youtube.playlists.list({
        part: ['snippet', 'status'],
        mine: true,
      });

      const playlists = response.data.items;

      if (playlists) {
        let newPlaylistDetected = false;

        for (const playlist of playlists) {
          const createdAt = new Date(playlist.snippet.publishedAt).getTime();

          if (createdAt > this.lastCheckTimestamp) {
            newPlaylistDetected = true;

            await this.actionService.executeReactions(reaction);
          }
        }

        if (newPlaylistDetected) {
          this.lastCheckTimestamp = Date.now();
        }
      }
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  async newDriveElement(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
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

      const drive = google.drive({ version: 'v3', auth: oAuth2Client });

      const response = await drive.files.list({
        pageSize: 1000,
        fields: 'files(id, name, createdTime)',
        orderBy: 'createdTime desc',
      });

      const files = response.data.files;

      if (files && files.length > 0) {
        let newFileDetected = false;

        for (const file of files) {
          const fileCreatedTime = new Date(file.createdTime).getTime();

          if (fileCreatedTime > this.lastCheckTimestamp) {
            newFileDetected = true;

            console.log(`New Drive File Detected: ${file.name || 'No Name'}`);

            await this.actionService.executeReactions(reaction);
          }
        }

        if (newFileDetected) {
          this.lastCheckTimestamp = Date.now();
        }
      }
    } catch (error) {
      console.error('ERROR:', error);
    }
  }
}
