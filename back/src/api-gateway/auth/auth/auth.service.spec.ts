import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              findFirst: jest.fn(),
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
            activeAction: {
              deleteMany: jest.fn(),
            },
            activeReaction: {
              deleteMany: jest.fn(),
            },
            $transaction: jest.fn((callback) =>
              callback({
                activeAction: {
                  deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
                },
                activeReaction: {
                  deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
                },
                workflows: {
                  deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
                },
                serviceTokens: {
                  deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
                },
                users: {
                  delete: jest.fn().mockResolvedValue({ id: 'user-id' }),
                },
              }),
            ),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mock-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed_password',
    };

    beforeEach(() => {
      (bcrypt.compare as jest.Mock).mockReset();
    });

    it('should successfully login a user', async () => {
      (prismaService.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('test@example.com', 'password123');

      expect(result).toEqual({
        token: 'mock-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      (prismaService.users.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login('nonexistent@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      (prismaService.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      const userId = 'user-id';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
      };

      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.deleteUser(userId);

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = 'nonexistent-id';

      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteUser(userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw Error when deletion fails', async () => {
      const userId = 'user-id';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
      };

      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prismaService.$transaction as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.deleteUser(userId)).rejects.toThrow(
        'Failed to delete user: Database error',
      );
    });
  });
});
