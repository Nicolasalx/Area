import { ApiProperty } from '@nestjs/swagger';
import { JsonValue } from '../types/json-value.type';

export class ReactionDto {
  @ApiProperty({
    description: 'The unique identifier of the reaction',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the reaction',
    example: 'send_email',
  })
  name: string;

  @ApiProperty({
    description: 'A brief description of the reaction',
    example: 'Sends an email when triggered.',
  })
  description: string;

  @ApiProperty({
    description: 'The trigger data associated with the reaction',
    example: { reaction: 'send_email' },
  })
  trigger: JsonValue;

  @ApiProperty({
    description: 'Whether the reaction is currently active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The date and time when the reaction was created',
    example: '2023-10-01T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The unique identifier of the associated service',
    example: 5,
  })
  serviceId: number;
}
