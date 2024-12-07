import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ConnectionType, Users } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @Get()
  async getUsers(): Promise<Users[]> {
    return this.userService.getUsers();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns a user by ID' })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Users> {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john_doe' },
        email: { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @Post()
  async createUser(
    @Body() body: { username: string; email: string; password: string },
  ): Promise<Users> {
    return this.userService.createUser(
      body.username,
      body.email,
      body.password,
      ConnectionType.CLASSIC,
    );
  }
}
