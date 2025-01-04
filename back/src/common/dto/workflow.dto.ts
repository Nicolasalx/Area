import { ApiProperty } from '@nestjs/swagger';

class WorkflowActionDto {
  @ApiProperty({
    description: 'Name of the action',
    example: 'new_card_created',
  })
  name: string;

  @ApiProperty({ description: 'Service name', example: 'trello' })
  service: string;

  @ApiProperty({ description: 'Service ID', example: 7 })
  serviceId: number;

  @ApiProperty({
    description: 'Action-specific data',
    example: { boardId: 'ABC' },
  })
  data: Record<string, any>;
}

class WorkflowReactionDto {
  @ApiProperty({ description: 'Name of the reaction', example: 'send_message' })
  name: string;

  @ApiProperty({ description: 'Service name', example: 'discord' })
  service: string;

  @ApiProperty({ description: 'Reaction trigger', example: 'send_message' })
  trigger: string;

  @ApiProperty({ description: 'Service ID', example: 3 })
  serviceId: number;

  @ApiProperty({
    description: 'Reaction-specific data',
    example: { message: 'Hello from Trello' },
  })
  data: Record<string, any>;
}

export class WorkflowDto {
  @ApiProperty({ description: 'The name of the workflow' })
  name: string;

  @ApiProperty({
    description: 'The session ID associated with the workflow',
    example: '21edea3a-b2d6-49e2-b0fc-8b5cbd92a31b',
  })
  sessionId: string;

  @ApiProperty({
    description: 'List of actions associated with the workflow',
    type: [WorkflowActionDto],
  })
  actions: WorkflowActionDto[];

  @ApiProperty({
    description: 'List of reactions associated with the workflow',
    type: [WorkflowReactionDto],
  })
  reactions: WorkflowReactionDto[];
}
