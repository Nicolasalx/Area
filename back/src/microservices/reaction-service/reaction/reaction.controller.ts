import { Controller, Post, Body, Get } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReactionDto } from '@common/dto/reaction.dto';

@ApiTags('Reactions')
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @ApiOperation({
    summary: 'Retrieve all reactions',
    description:
      'Fetch all reactions available in the system with their details.',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of all reactions successfully retrieved.',
    type: [ReactionDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred while fetching reactions.',
  })
  @Get()
  async getReactions(): Promise<ReactionDto[]> {
    return this.reactionService.getReactions();
  }

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
