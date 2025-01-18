import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SpotifyReactionService {
  async manageReactionSpotify(
    refreshToken: string,
    reaction: string,
    data: any,
  ): Promise<string> {
    switch (reaction.toLowerCase()) {
      case 'create_spotify_playlist':
        return this.createPlaylist(refreshToken, data);
      case 'add_song_to_playlist':
        return this.addSongToPlaylist(refreshToken, data);
      default:
        return 'Reaction not recognized for Spotify';
    }
  }

  private async createPlaylist(
    refreshToken: string,
    data: {
      playlist_name: string;
      playlist_type: string;
    },
  ): Promise<string> {
    if (!refreshToken) {
      console.log('Access token not available');
      return 'Access token not available';
    }

    try {
      const userResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const userId = userResponse.data.id;

      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: data.playlist_name,
          description: `Playlist created`,
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const playlistId = playlistResponse.data.id;
      return `Playlist created successfully! ID: ${playlistId}, Name: ${data.playlist_name}`;
    } catch (error) {
      console.error(
        'Error creating Spotify playlist:',
        error.response ? error.response.data : error.message,
      );
      return 'Failed to create playlist on Spotify';
    }
  }

  private async addSongToPlaylist(
    refreshToken: string,
    data: {
      playlist_name: string;
      song_name: string;
    },
  ): Promise<string> {
    if (!refreshToken) {
      console.log('Access token not available');
      return 'Access token not available';
    }

    try {
      const playlistsResponse = await axios.get(
        'https://api.spotify.com/v1/me/playlists',
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const playlists = playlistsResponse.data.items;

      if (!playlists || playlists.length === 0) {
        console.log('No playlists found.');
        return 'No playlists found.';
      }

      const playlist = playlists.find(
        (playlist: any) => playlist.name === data.playlist_name,
      );

      if (!playlist) {
        console.log(`Playlist "${data.playlist_name}" not found.`);
        return `Playlist "${data.playlist_name}" not found.`;
      }

      const searchResponse = await axios.get(
        'https://api.spotify.com/v1/search',
        {
          params: {
            q: data.song_name,
            type: 'track',
            limit: 1,
          },
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const tracks = searchResponse.data.tracks.items;

      if (!tracks || tracks.length === 0) {
        console.log(`Song "${data.song_name}" not found.`);
        return `Song "${data.song_name}" not found.`;
      }

      const songUri = tracks[0].uri;

      const playlistId = playlist.id;
      const addTrackResponse = await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: [songUri],
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      if (addTrackResponse.status === 201) {
        console.log(
          `Song "${data.song_name}" successfully added to playlist "${data.playlist_name}".`,
        );
        return `Song "${data.song_name}" successfully added to playlist "${data.playlist_name}".`;
      }

      console.error('Failed to add song to playlist.');
      return 'Failed to add song to playlist.';
    } catch (error) {
      console.error(
        'Error adding song to playlist:',
        error.response ? error.response.data : error.message,
      );
      return 'Error adding song to playlist.';
    }
  }
}
