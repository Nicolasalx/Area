import { ApiProperty } from '@nestjs/swagger';

export class Reaction {
  @ApiProperty({ description: 'The name of the reaction' })
  name: string;

  @ApiProperty({
    description:
      'The trigger for the reaction (e.g., send_email, set_calendar_event)',
  })
  trigger: string;

  @ApiProperty({
    description: 'The service for the reaction (e.g., google, facebook)',
  })
  service: string;

  @ApiProperty({ description: 'The token used for the reaction' })
  token: string;
}
