import { Controller, Post, Body } from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  async handleReaction(
    @Body() body: { service: string; reaction: string; data: any },
  ): Promise<string> {
    const { service, reaction, data } = body;

    console.log(`Received request to handle reaction for service: ${service}`);
    try {
      return await this.reactionService.handleReaction(service, reaction, data);
    } catch (error) {
      console.error(error.message);
      return 'Failed to process the request';
    }
  }
}
