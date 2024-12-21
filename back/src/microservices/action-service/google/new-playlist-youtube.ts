import { IngredientsAction } from '@common/interfaces/ingredientsAction';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import { google } from 'googleapis';

async function createIngredientsAction(
  playlistDetails: any,
): Promise<IngredientsAction[]> {
  return [
    { field: 'playlist_name', value: playlistDetails.snippet.title },
    { field: 'playlist_type', value: playlistDetails.status.privacyStatus },
    { field: 'trigger_date', value: getTriggerDate() },
  ];
}

export async function newPlaylistYoutube(
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

        if (createdAt > action.lastCheckTimestamp) {
          newPlaylistDetected = true;

          const ingredients = await createIngredientsAction(playlist);

          await actionService.executeReactions(ingredients, reaction);
        }
      }

      if (newPlaylistDetected) {
        action.lastCheckTimestamp = Date.now();
      }
    }
  } catch (error) {
    console.error('ERROR:', error);
  }
}
