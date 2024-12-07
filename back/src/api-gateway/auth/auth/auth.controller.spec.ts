import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        PrismaService,
        {
          provide: 'JWT_SECRET',
          useValue: 'test-secret',
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return successful login response', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockLoginResponse = {
        token: 'mock-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        success: true,
        message: 'Login successful',
        data: mockLoginResponse,
      });
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
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

      jest
        .spyOn(authService, 'deleteUser')
        .mockResolvedValue(mockDeleteResponse);

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
