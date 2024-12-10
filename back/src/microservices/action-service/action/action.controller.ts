import { Controller, Get, UseGuards } from '@nestjs/common';
import { ActionService } from './action.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ActionDto } from '@common/dto/action.dto';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard';

@ApiTags('Actions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
}
