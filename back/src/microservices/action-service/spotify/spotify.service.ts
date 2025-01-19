import { ActionService } from '@action-service/action/action.service';
import { getToken, getUserId } from '@common/utils/token.utils';
import { Injectable } from '@nestjs/common';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import axios from 'axios';

@Injectable()
export class SpotifyActionService {
  private lastPlayedTrackId: string | null = null;
  private previousPlaylistIds: Set<string> = new Set();

  constructor(private readonly actionService: ActionService) {}

  async newMusicPlayed(action: any, reaction: any[]): Promise<void> {
    const { workflowId } = action;

    const REFRESH_TOKEN = await getToken(
      await getUserId(workflowId),
      'spotify',
    );

    if (!REFRESH_TOKEN) {
      console.log('Access token not available');
      return;
    }

    try {
      const response = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          headers: {
            Authorization: `Bearer ${REFRESH_TOKEN}`,
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
    const { workflowId } = action;

    const REFRESH_TOKEN = await getToken(
      await getUserId(workflowId),
      'spotify',
    );

    if (!REFRESH_TOKEN) {
      console.log('Access token not available');
      return;
    }

    try {
      const response = await axios.get(
        'https://api.spotify.com/v1/me/playlists',
        {
          headers: {
            Authorization: `Bearer ${REFRESH_TOKEN}`,
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
