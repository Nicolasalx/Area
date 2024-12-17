import { Injectable } from '@nestjs/common';
import { GoogleReactionService } from '../google/google.service';
import { DiscordReactionService } from '../discord/discord.service';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { ReactionDto } from '@common/dto/reaction.dto';
import { SlackReactionService } from '@reaction-service/slack/slack.service';

@Injectable()
export class ReactionService {
  constructor(
    private readonly googleService: GoogleReactionService,
    private readonly discordService: DiscordReactionService,
    private readonly slackService: SlackReactionService,
    private readonly prisma: PrismaService,
  ) {}

  async getReactions(): Promise<ReactionDto[]> {
    const reactions = await this.prisma.reactions.findMany({
      include: {
        service: true,
      },
    });

    return reactions.map((reaction) => ({
      id: reaction.id,
      name: reaction.name,
      description: reaction.description,
      trigger: reaction.trigger,
      isActive: reaction.isActive,
      createdAt: reaction.createdAt,
      serviceId: reaction.serviceId,
      service: reaction.service,
      body: reaction.body,
    }));
  }

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
      case 'slack':
        return await this.slackService.handleAction(reaction, data);
      default:
        throw new Error('Service not recognized');
    }
  }
}
