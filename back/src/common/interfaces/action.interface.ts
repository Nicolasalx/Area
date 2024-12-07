import { ApiProperty } from '@nestjs/swagger';

export class Action {
  @ApiProperty({ description: 'The name of the action' })
  name: string;

  @ApiProperty({
    description: 'The service for the action (e.g., google, facebook)',
  })
  service: string;

  @ApiProperty({ description: 'The token used for the action' })
  token: string;
}
