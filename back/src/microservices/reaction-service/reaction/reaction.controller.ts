import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { ReactionDto } from '@common/dto/reaction.dto';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard';

class HandleReactionDto {
  refreshToken: string;
  service: string;
  reaction: string;
  data: any;
}

@ApiTags('Reactions')
@UseGuards(JwtAuthGuard)
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
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'send_email' },
          description: {
            type: 'string',
            example: 'Sends an email when triggered.',
          },
          trigger: {
            type: 'object',
            example: { reaction: 'send_email' },
          },
          isActive: { type: 'boolean', example: true },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-01-03T13:24:56.738Z',
          },
          serviceId: { type: 'number', example: 1 },
          service: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'google' },
              description: {
                type: 'string',
                example: 'Google services like Gmail, Calendar, Drive, etc.',
              },
              isActive: { type: 'boolean', example: true },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-01-03T13:24:56.725Z',
              },
            },
          },
          body: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'from' },
                description: {
                  type: 'string',
                  example: 'The senders email address of the request',
                },
              },
            },
          },
        },
      },
    },
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
      if (
        service == 'google' ||
        service == 'spotify' ||
        service == 'trello' ||
        service == 'todoist' ||
        service == 'slack'
      ) {
        return await this.reactionService.redirectServiceTokens(
          service,
          refreshToken,
          reaction,
          data,
        );
      }
      return await this.reactionService.handleReaction(service, reaction, data);
    } catch (error) {
      console.error(error.message);
      return 'Failed to process the request';
    }
  }
}
