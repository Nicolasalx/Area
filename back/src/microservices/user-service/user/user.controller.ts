import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<Users[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Users> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(
    @Body() body: { username: string; email: string; password: string },
  ): Promise<Users> {
    return this.userService.createUser(
      body.username,
      body.email,
      body.password,
    );
  }
}
