import { Action } from '@common/interfaces/action.interface';
import { Reaction } from '@common/interfaces/reaction.interface';
import { ApiProperty } from '@nestjs/swagger';

export class WorkflowDto {
  @ApiProperty({ description: 'The name of the workflow' })
  name: string;

  @ApiProperty({ description: 'The session ID associated with the workflow' })
  sessionId: string;

  @ApiProperty({
    description: 'List of actions associated with the workflow',
    type: [Action],
  })
  actions: Action[];

  @ApiProperty({
    description: 'List of reactions associated with the workflow',
    type: [Reaction],
  })
  reactions: Reaction[];
}
