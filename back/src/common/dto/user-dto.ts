import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'f4cd2802-11b5-4c90-91e7-24726f04ebaf',
  })
  id: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Manuel Tome',
  })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'manuel.tome@epitech.eu',
  })
  email: string;

  @ApiProperty({
    description: 'Picture URL of the user',
    example: null,
  })
  picture: string | null;

  @ApiProperty({
    description: 'User status (active or inactive)',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2025-01-02T15:24:49.369Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'User type (e.g., CLASSIC, PREMIUM)',
    example: 'CLASSIC',
  })
  type: string;
}
