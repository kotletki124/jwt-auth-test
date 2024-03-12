import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  UnauthorizedException,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { User } from '../user/user.entity';
import type { Token } from 'src/shared/types';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    try {
      const user = await this.authService.register(registerDto);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(
    @Response({ passthrough: true }) response,
    @Body() { tokenDuration: tokenDurationArg, ...credentials }: LoginDto,
  ): Promise<{ id: number; accessToken: Token }> {
    const user = await this.authService.validateCredentials(credentials);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokenDuration = tokenDurationArg || 300000;
    const iat = new Date().getTime();
    const exp = iat + tokenDuration;
    const accessToken = await this.authService.generateAccessToken(user, {
      iat: Math.floor(iat / 1000),
      exp: Math.floor(exp / 1000),
    });

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return {
      id: user.id,
      accessToken: { value: accessToken, iat, exp },
    };
  }

  @Get('logout')
  async logout(@Response({ passthrough: true }) response) {
    response.clearCookie('accessToken');
    return true;
  }
}
