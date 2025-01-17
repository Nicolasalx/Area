import { ActionService } from '@action-service/action/action.service';
import { Injectable } from '@nestjs/common';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import axios from 'axios';

/* Get token (to set in env at SPOTIFY_TOKEN)
1) https://accounts.spotify.com/authorize?response_type=code&client_id=fca2d65b4f744cb6916bb40bcc2758fd&scope=user-library-read%20playlist-read-private%20user-top-read%20user-read-playback-state%20playlist-modify-private%20playlist-modify-public&redirect_uri=http://localhost:8081/

After we are redirected in this page:
2) http://localhost:8081/?code=AQBNypG11rJ9Xu9vrqoPN8zV8eIRLUslTtVqOju-L-_qodvdl4TyJAhI7Aq3PEa15a5PDkLuMzZPmW2oTQ42kPaU6131WR5MN2fBBCI3vquWPFIyxdQ0E7wYcK0b3rRxx0G69ZuCb4zf7TO6ma8mSHjgKfyALN9ypuTsh7nEgw3wIl__ziD4pkMZlGoj4UzenMo5dcQ7zrM2xi607TBDgBlXB8tI6PL4pURMEzr3MwYTo-w

3) Make a curl:
curl -X POST https://accounts.spotify.com/api/token \
  -H "Authorization: Basic ZmNhMmQ2NWI0Zjc0NGNiNjkxNmJiNDBiY2MyNzU4ZmQ6MGI3MzRhZTg0M2ExNGU3Zjg1NWE5ZGJmYjYxYTQzYjE=" \
  -d "grant_type=authorization_code" \
  -d "code=CODE_GET_IN_STEP_2" \
  -d "redirect_uri=http://localhost:8081/"
*/

@Injectable()
export class SpotifyActionService {
  private lastPlayedTrackId: string | null = null;
  private previousPlaylistIds: Set<string> = new Set();

  constructor(private readonly actionService: ActionService) {}

  async newMusicPlayed(action: any, reaction: any[]): Promise<void> {
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

    if (!accessToken) {
      console.log('Access token not available');
      return;
    }

    try {
      const response = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const trackData = response.data;

      if (!trackData || !trackData.item) {
        console.log('No track is currently playing.');
        return;
      }

      const currentTrackId = trackData.item.id;

      if (!this.lastPlayedTrackId) {
        this.lastPlayedTrackId = currentTrackId;
        return;
      }

      if (currentTrackId !== this.lastPlayedTrackId) {
        this.lastPlayedTrackId = currentTrackId;
        const ingredients = [
          { field: 'song_name', value: trackData.item.name || 'No Name' },
          {
            field: 'song_artists',
            value:
              trackData.item.artists.map((artist) => artist.name).join(', ') ||
              'No Artists',
          },
          {
            field: 'song_release_date',
            value: trackData.item.album.release_date || 'No Release Date',
          },
          { field: 'trigger_date', value: getTriggerDate() },
        ];
        console.log('New song detected from Spotify !');

        await this.actionService.executeReactions(ingredients, reaction);
      }
    } catch (error) {
      console.error(
        'Error checking currently playing track:',
        error.response ? error.response.status : error.message,
      );
    }
  }

  async newTrackAddedToPlaylist(action: any, reaction: any[]): Promise<void> {
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

    if (!accessToken) {
      console.log('Access token not available');
      return;
    }

    try {
      const response = await axios.get(
        'https://api.spotify.com/v1/me/playlists',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const playlists = response.data.items;

      if (!playlists || playlists.length === 0) {
        console.log('No playlists found.');
        return;
      }

      if (this.previousPlaylistIds.size === 0) {
        playlists.forEach((playlist: any) => {
          this.previousPlaylistIds.add(playlist.id);
        });
      } else {
        const newPlaylists = playlists.filter(
          (playlist: any) => !this.previousPlaylistIds.has(playlist.id),
        );

        if (newPlaylists.length > 0) {
          console.log('New playlists detected on Spotify !');
          newPlaylists.forEach(async (playlist) => {
            const ingredients = [
              { field: 'playlist_name', value: playlist.name || 'No Name' },
              {
                field: 'playlist_owner_name',
                value: playlist.owner.display_name || 'No Artists',
              },
              {
                field: 'playlist_id',
                value: playlist.id || 'No Release Date',
              },
              { field: 'trigger_date', value: getTriggerDate() },
            ];

            await this.actionService.executeReactions(ingredients, reaction);
          });

          newPlaylists.forEach((playlist) => {
            this.previousPlaylistIds.add(playlist.id);
          });
        }
      }
    } catch (error) {
      console.error(
        'Error fetching playlists:',
        error.response ? error.response.status : error.message,
      );
    }
  }
}
