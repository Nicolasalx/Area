import { ApiProperty } from '@nestjs/swagger';

export class WorkflowDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID who owns this workflow',
  })
  userId: string;

  @ApiProperty({ example: 'My Workflow', description: 'Name of the workflow' })
  name: string;

  @ApiProperty({
    example: 'This workflow does X when Y happens',
    description: 'Description of what the workflow does',
  })
  description: string;

  @ApiProperty({ example: true, description: 'Whether the workflow is active' })
  isActive: boolean;

  @ApiProperty({
    example: [1, 2],
    description: 'IDs of actions associated with this workflow',
  })
  actionIds: number[];
}

export class WorkflowResponseDto {
  @ApiProperty({ example: 1, description: 'Workflow ID' })
  id: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: 'My Workflow' })
  name: string;

  @ApiProperty({ example: 'This workflow does X when Y happens' })
  description: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-03-19T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ type: [Number], example: [1, 2] })
  actionIds: number[];
}