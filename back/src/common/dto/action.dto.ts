import { ApiProperty } from '@nestjs/swagger';

export class ActionDto {
  @ApiProperty({
    description: 'The unique identifier of the action',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the action',
    example: 'receive_email',
  })
  name: string;

  @ApiProperty({
    description: 'A brief description of the action',
    example: 'Triggered when an email is received.',
  })
  description: string;

  @ApiProperty({
    description: 'Whether the action is currently active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The date and time when the action was created',
    example: '2023-10-01T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The ID of the service this action belongs to',
    example: 1,
  })
  serviceId: number;

  @ApiProperty({
    description: 'The service details',
    example: {
      id: 1,
      name: 'google',
      description: 'Google services',
    },
  })
  service: {
    id: number;
    name: string;
    description: string;
  };
}
