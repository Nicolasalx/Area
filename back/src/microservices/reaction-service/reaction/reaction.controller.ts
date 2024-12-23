import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ReactionDto } from '@common/dto/reaction.dto';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard';
import { GoogleReactionService } from '@reaction-service/google/google.service';
import { google } from 'googleapis';

class HandleReactionDto {
  refreshToken: string;
  service: string;
  reaction: string;
  data: any;
}

@ApiTags('Reactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reactions')
export class ReactionController {
  constructor(
    private readonly reactionService: ReactionService,
    private readonly googleService: GoogleReactionService,
  ) {}

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
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred while fetching reactions.',
  })
  @Get()
  async getReactions(): Promise<ReactionDto[]> {
    return this.reactionService.getReactions();
  }

  @ApiOperation({
    summary: 'Handle a reaction',
    description:
      'Process a reaction for a specific service with provided data.',
  })
  @ApiBody({
    type: HandleReactionDto,
    description: 'Reaction details and data',
  })
  @ApiResponse({
    status: 200,
    description: 'Reaction successfully handled',
    schema: {
      type: 'string',
      example: 'Reaction processed successfully',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to process the reaction',
    schema: {
      type: 'string',
      example: 'Failed to process the request',
    },
  })
  @Post()
  async handleReaction(@Body() body: HandleReactionDto): Promise<string> {
    const { refreshToken, service, reaction, data } = body;
    try {
      if (service == 'google') {
        this.googleService.manageReactionGoogle(refreshToken, reaction, data);
      }
      return await this.reactionService.handleReaction(service, reaction, data);
    } catch (error) {
      console.error(error.message);
      return 'Failed to process the request';
    }
  }
}
