import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { IActionHandler } from './base.handler';
import { SpotifyActionService } from '@action-service/spotify/spotify.service';

@Injectable()
export class SpotifyActionHandler implements IActionHandler {
  constructor(private readonly spotifyActionService: SpotifyActionService) {}

  canHandle(action: string): boolean {
    return ['new_music_played', 'new_playlist_created_spotify'].includes(
      action,
    );
  }

  async handle(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    switch (action.name) {
      case 'new_music_played':
        await this.spotifyActionService.newMusicPlayed(action, reactions);
        break;
      case 'new_playlist_created_spotify':
        await this.spotifyActionService.newTrackAddedToPlaylist(
          action,
          reactions,
        );
        break;
    }
  }
}
