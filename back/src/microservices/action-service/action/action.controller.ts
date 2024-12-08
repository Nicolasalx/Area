import { Controller, Get } from '@nestjs/common';
import { ActionService } from './action.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActionDto } from '@common/dto/action.dto';

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
    status: 500,
    description: 'Internal server error occurred while fetching actions.',
  })
  @Get()
  async getActions(): Promise<ActionDto[]> {
    return this.actionService.getActions();
  }
}
