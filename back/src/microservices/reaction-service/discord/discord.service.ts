import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface DiscordWebhook {
  url: string;
  channelId: string;
  token: string;
}

@Injectable()
export class DiscordReactionService {
  private webhook: DiscordWebhook;

  constructor() {
    this.webhook = {
      url: process.env.DISCORD_WEBHOOK_URL,
      channelId: process.env.DISCORD_CHANNEL_ID,
      token: process.env.DISCORD_TOKEN,
    };
  }

  async handleAction(reaction: string, data: any): Promise<string> {
    switch (reaction.toLowerCase()) {
      case 'send_message':
        return this.sendMessage(data);
      default:
        return 'Reaction not recognized for Discord';
    }
  }

  private async sendMessage(data: { message: string }): Promise<string> {
    const { message } = data;

    try {
      await axios.post(this.webhook.url, {
        content: message,
      });
    } catch (error) {
      console.error('Error sending message to Discord:', error);
      return 'Error sending message to Discord';
    }
    return 'Message sent';
  }
}
