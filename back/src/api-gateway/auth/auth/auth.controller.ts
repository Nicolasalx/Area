import {
  Body,
  Controller,
  Post,
  Delete,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

class LoginDto {
  email: string;
  password: string;
}

class LoginResponseDto {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticate user with email and password to receive a JWT token',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User credentials',
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'Password123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Invalid credentials' },
        error: { type: 'string', example: 'User not found' },
      },
    },
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    try {
      this.logger.debug(`Login attempt for email: ${body.email}`);
      const result = await this.authService.login(body.email, body.password);

      const response = {
        success: true,
        message: 'Login successful',
        data: result,
      };

      this.logger.debug('Login successful');
      return response;
    } catch (err) {
      this.logger.error('Login failed:', err);

      const errorResponse = {
        success: false,
        message: 'Invalid credentials',
        error: err.message,
      };

      throw new UnauthorizedException(errorResponse);
    }
  }

  @ApiOperation({
    summary: 'Delete user account',
    description: "Permanently delete the authenticated user's account",
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Account successfully deleted',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Account deleted successfully' },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User deleted successfully' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid token',
    schema: {
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      properties: {
        message: { type: 'string', example: 'User not found' },
      },
    },
  })
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Request() req) {
    try {
      const userId = req.user.sub;

      if (!userId) {
        throw new UnauthorizedException('User ID not found in token');
      }

      const result = await this.authService.deleteUser(userId);

      const response = {
        success: true,
        message: 'Account deleted successfully',
        data: result,
      };

      return response;
    } catch (err) {
      throw err;
    }
  }
}
