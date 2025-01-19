import { Injectable } from '@nestjs/common';
import { IReactionHandler } from '@reaction-service/handler/base.handler';
import axios from 'axios';

@Injectable()
export class DiscordReactionService implements IReactionHandler {
  constructor() {}

  canHandle(service: string): boolean {
    return service === 'discord';
  }

  async handle(reaction: string, data: any): Promise<string> {
    switch (reaction.toLowerCase()) {
      case 'send_message':
        return this.sendMessage(data);
      default:
        return 'Reaction not recognized for Discord';
    }
  }

  private async sendMessage(data: {
    message: string;
    webhookUrl: string;
  }): Promise<string> {
    const { message, webhookUrl } = data;

    try {
      await axios.post(webhookUrl, {
        content: message,
      });
    } catch (error) {
      console.error('Error sending message to Discord:', error);
      return 'Error sending message to Discord';
    }
    return 'Message sent';
  }
}
