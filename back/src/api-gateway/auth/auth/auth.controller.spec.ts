import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { UserService } from '@userService/user/user.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            workflows: {
              deleteMany: jest.fn(),
            },
            serviceTokens: {
              deleteMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mock-token'),
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              post: jest.fn(),
              request: jest.fn(),
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserByServiceId: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(AuthService)
      .useValue({
        login: jest.fn(),
        deleteUser: jest.fn(),
        getGoogleOAuth: jest.fn(),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return successful login response', async () => {
      const mockLoginResult = {
        token: 'mock-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      (authService.login as jest.Mock).mockResolvedValue(mockLoginResult);

      const result = await controller.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        success: true,
        message: 'Login successful',
        data: mockLoginResult,
      });
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      (authService.login as jest.Mock).mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(
        controller.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockRequest = {
        user: { sub: 'user-id' },
      };

      const mockDeleteResponse = {
        message: 'User deleted successfully',
      };

      (authService.deleteUser as jest.Mock).mockResolvedValue(
        mockDeleteResponse,
      );

      const result = await controller.deleteUser(mockRequest);

      expect(result).toEqual({
        success: true,
        message: 'Account deleted successfully',
        data: mockDeleteResponse,
      });
    });

    it('should throw UnauthorizedException when user ID is missing', async () => {
      const mockRequest = {
        user: {},
      };

      await expect(controller.deleteUser(mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
