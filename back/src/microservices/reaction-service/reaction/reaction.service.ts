import { Injectable } from '@nestjs/common';
import { GoogleService } from '../google/google.service';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class ReactionService {
  constructor(
    private readonly googleService: GoogleService,
    private readonly discordService: DiscordService,
  ) {}

  async handleReaction(
    service: string,
    reaction: string,
    data: any,
  ): Promise<string> {
    console.log(`Delegating reaction handling for service: ${service}`);

    switch (service.toLowerCase()) {
      case 'google':
        return await this.googleService.handleAction(reaction, data);
      case 'discord':
        return await this.discordService.handleAction(reaction, data);
      default:
        throw new Error('Service not recognized');
    }
  }
}
