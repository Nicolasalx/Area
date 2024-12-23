import { IngredientsAction } from '@common/interfaces/ingredientsAction';
import { getToken, getUserId } from '@common/utils/token.utils';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import { google } from 'googleapis';

async function createIngredientsAction(
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

  const decodedBody = body ? Buffer.from(body, 'base64').toString('utf8') : '';

  const cleanedBody = decodedBody.replace(/\r?\n$/, '');

  const sender = fromHeader ? fromHeader.value : 'No sender';

  return [
    { field: 'sender', value: sender },
    { field: 'subject', value: subjectHeader?.value || 'No Subject' },
    { field: 'body', value: cleanedBody },
    { field: 'trigger_date', value: getTriggerDate() },
  ];
}

export async function receiveNewEmail(
  action: any,
  reaction: any[],
  actionService: any,
): Promise<void> {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
  const { workflowId } = action;
  const REFRESH_TOKEN = await getToken(await getUserId(workflowId), 'google');

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

        const receivedDate = parseInt(messageDetails.data.internalDate || '0');

        if (receivedDate > action.lastCheckTimestamp) {
          newEmailDetected = true;

          const ingredients = await createIngredientsAction(messageDetails);

          await actionService.executeReactions(ingredients, reaction);
        }
      }

      if (newEmailDetected) {
        action.lastCheckTimestamp = Date.now();
      }
    }
  } catch (error) {
    console.error('ERROR:', error);
  }
}
