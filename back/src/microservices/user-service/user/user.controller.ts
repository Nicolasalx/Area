import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConnectionType, Users } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

class CreateUserDto {
  username: string;
  email: string;
  password: string;
}

class UserResponseDto {
  id: string;
  email: string;
  name: string;
}

@ApiTags('Users')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create new user',
    description:
      'Register a new user account with username, email, and password',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration details',
    examples: {
      example1: {
        value: {
          username: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'User with this email already exists',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
    schema: {
      properties: {
        message: { type: 'string', example: 'Invalid email format' },
      },
    },
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserDto): Promise<Users> {
    this.logger.debug('Creating user with data:', {
      ...body,
      password: '[REDACTED]',
    });

    return this.userService.createUser(
      body.username,
      body.email,
      body.password,
      ConnectionType.CLASSIC,
    );
  }

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

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    this.logger.debug(`Deleting user with id: ${id}`);
    return this.userService.deleteUser(id);
  }
}
