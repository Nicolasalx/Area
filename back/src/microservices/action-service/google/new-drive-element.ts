import { IngredientsAction } from '@common/interfaces/ingredientsAction';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import { google } from 'googleapis';

async function createIngredientsAction(
  elementDetails: any,
  elementType: string,
): Promise<IngredientsAction[]> {
  return [
    { field: 'element_name', value: elementDetails.name },
    { field: 'element_type', value: elementType },
    { field: 'trigger_date', value: getTriggerDate() },
  ];
}

export async function newDriveElement(
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

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    const response = await drive.files.list({
      pageSize: 1000,
      fields: 'files(id, name, createdTime, mimeType)',
      orderBy: 'createdTime desc',
    });

    const files = response.data.files;

    if (files && files.length > 0) {
      let newFileDetected = false;

      for (const file of files) {
        const fileCreatedTime = new Date(file.createdTime).getTime();

        if (fileCreatedTime > action.lastCheckTimestamp) {
          newFileDetected = true;

          let elementType: string;

          switch (file.mimeType) {
            case 'application/vnd.google-apps.document':
              elementType = 'Google Docs';
              break;
            case 'application/vnd.google-apps.spreadsheet':
              elementType = 'Google Sheets';
              break;
            case 'application/vnd.google-apps.presentation':
              elementType = 'Google Slides';
              break;
            case 'application/vnd.google-apps.folder':
              elementType = 'Folder';
              break;
            default:
              elementType = 'Unknown';
          }

          console.log(
            `New Drive File Detected: ${file.name || 'No Name'}, Type: ${elementType}`,
          );

          const ingredients = await createIngredientsAction(file, elementType);

          await actionService.executeReactionsBis(ingredients, reaction);
        }
      }

      if (newFileDetected) {
        action.lastCheckTimestamp = Date.now();
      }
    }
  } catch (error) {
    console.error('ERROR:', error);
  }
}
