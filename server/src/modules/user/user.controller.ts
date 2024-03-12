import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Request,
  Param,
  Body,
  NotFoundException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, CheckEmailDto } from './user.dto';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(
    @Request() request,
    @Param('id') id: number,
  ): Promise<User> {
    if (request.user.sub !== id) throw new ForbiddenException();
    const user = await this.userService.getUserBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateUser(
    @Request() request,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (request.user.sub !== id) throw new ForbiddenException();
    const user = await this.userService.updateUser(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(
    @Request() request,
    @Param('id') id: number,
  ): Promise<boolean> {
    if (request.user.sub !== id) throw new ForbiddenException();
    await this.userService.deleteUser(id);
    return true;
  }

  @Post('check')
  async isEmailAvailable(
    @Body() checkEmailDto: CheckEmailDto,
  ): Promise<boolean> {
    return this.userService.isEmailAvailable(checkEmailDto);
  }
}
