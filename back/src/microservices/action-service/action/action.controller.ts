import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { ActionService } from './action.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActionDto } from '@common/dto/action.dto';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('Actions')
@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @ApiOperation({
    summary: 'Retrieve all actions',
    description:
      'Fetch all actions available in the system with their details.',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of all actions successfully retrieved.',
    type: [ActionDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred while fetching actions.',
  })
  @Get()
  async getActions(): Promise<ActionDto[]> {
    return this.actionService.getActions();
  }

  @ApiOperation({
    summary: 'Retrieve action ingredients',
    description: 'Fetch all ingredients available for a specific action.',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of action ingredients successfully retrieved.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string', example: 'repository_owner' },
          description: {
            type: 'string',
            example: 'Name of the repository owner on GitHub',
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
    status: 404,
    description: 'Action not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred while fetching ingredients.',
  })
  @Get(':id/ingredients')
  async getActionIngredients(@Param('id') id: string) {
    return this.actionService.getActionIngredients(parseInt(id));
  }
}
