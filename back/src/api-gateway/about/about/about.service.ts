import { Injectable } from '@nestjs/common';
import { AboutResponseDto, ServiceDto, ActionDto, ReactionDto } from 'src/common/dto/about/about.dto';

@Injectable()
export class AboutService {
  getAbout(clientHost: string): AboutResponseDto {
    const currentTime = Math.floor(Date.now() / 1000);
    return {
      client: {
        host: clientHost,
      },
      server: {
        current_time: currentTime,
        services: this.getServices(),
      },
    };
  }

  private getServices(): ServiceDto[] {
    return [
      {
        name: 'facebook',
        actions: this.getFacebookActions(),
        reactions: this.getFacebookReactions(),
      },
      {
        name: 'twitter',
        actions: this.getTwitterActions(),
        reactions: this.getTwitterReactions(),
      },
    ];
  }

  private getFacebookActions(): ActionDto[] {
    return [
      { name: 'new_message_in_group', description: 'A new message is posted in the group' },
      { name: 'new_message_inbox', description: 'A new private message is received by the user' },
      { name: 'new_like', description: 'The user gains a like from one of their messages' },
    ];
  }

  private getFacebookReactions(): ReactionDto[] {
    return [
      { name: 'like_message', description: 'The user likes a message' },
    ];
  }

  private getTwitterActions(): ActionDto[] {
    return [
      { name: 'new_tweet', description: 'A new tweet is posted by the user' },
      { name: 'new_follower', description: 'The user gains a new follower' },
    ];
  }

  
  private getTwitterReactions(): ReactionDto[] {
    return [
      { name: 'retweet', description: 'The user retweets a message' },
      { name: 'follow_user', description: 'The user follows another user' },
    ];
  }
}
