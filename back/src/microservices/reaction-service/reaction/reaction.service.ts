import { Injectable } from '@nestjs/common';
import { DiscordReactionService } from '../discord/discord.service';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { ReactionDto } from '@common/dto/reaction.dto';
import { SlackReactionService } from '@reaction-service/slack/slack.service';
import { TodoistReactionService } from '@reaction-service/todoist/todoist.service';
import { IReactionHandler } from '@reaction-service/handler/base.handler';
import { TrelloReactionService } from '@reaction-service/trello/trello.service';
import { TwilioReactionService } from '@reaction-service/twilio/twilio.service';

@Injectable()
export class ReactionService {
  private handlers: IReactionHandler[];

  constructor(
    private readonly discordService: DiscordReactionService,
    private readonly slackService: SlackReactionService,
    private readonly todoistService: TodoistReactionService,
    private readonly prisma: PrismaService,
    private readonly trelloService: TrelloReactionService,
    private readonly twilioService: TwilioReactionService,
  ) {
    this.handlers = [
      discordService,
      slackService,
      trelloService,
      todoistService,
      twilioService,
    ];
  }

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

    const handler = this.handlers.find((h) =>
      h.canHandle(service.toLowerCase()),
    );
    if (!handler) {
      throw new Error('Service not recognized');
    }

    return handler.handle(reaction, data);
  }
}
