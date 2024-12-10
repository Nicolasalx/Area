import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    this.logger.debug(`Auth header: ${authHeader}`);
    this.logger.debug(`Request path: ${request.path}`);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.error('Missing or invalid authorization header');
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    this.logger.debug(`Token: ${token.substring(0, 20)}...`);

    try {
      const payload = this.jwtService.verify(token);
      this.logger.debug(`Token payload: ${JSON.stringify(payload)}`);
      request.user = payload;
      return true;
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      this.logger.debug(
        `JWT Secret used: ${process.env.JWT_SECRET || 'your-secret-key'}`,
      );
      throw new UnauthorizedException('Invalid token');
    }
  }
}
