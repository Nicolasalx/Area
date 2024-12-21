import { IngredientsAction } from '@common/interfaces/ingredientsAction';
import {
  getTriggerDate,
  getUserFriendlyDate,
} from '@trigger-service/handler/get-trigger-date';
import { google } from 'googleapis';

async function createIngredientsAction(
  eventDetails: any,
): Promise<IngredientsAction[]> {
  const eventName = eventDetails.summary || 'No Event Name';
  const eventDate =
    getUserFriendlyDate(new Date(eventDetails.start.dateTime)) ||
    'No Event Date';

  const triggerDate = getTriggerDate();

  return [
    { field: 'event_name', value: eventName },
    { field: 'event_date', value: eventDate },
    { field: 'trigger_date', value: triggerDate },
  ];
}

export async function newCalendarEvent(
  action: any,
  reaction: any[],
  actionService: any,
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
      fields: 'items(id, summary, created, start)',
    });

    const events = response.data.items;

    if (events && events.length > 0) {
      let newEventDetected = false;

      for (const event of events) {
        const eventCreatedTime = new Date(event.created).getTime();

        if (eventCreatedTime > action.lastCheckTimestamp) {
          newEventDetected = true;

          console.log(
            `New Calendar Event Created: ${event.summary || 'No Title'}`,
          );

          const ingredients = await createIngredientsAction(event);
          await actionService.executeReactions(ingredients, reaction);
        }
      }

      if (newEventDetected) {
        action.lastCheckTimestamp = Date.now();
      }
    }
  } catch (error) {
    console.error('ERROR:', error);
  }
}
