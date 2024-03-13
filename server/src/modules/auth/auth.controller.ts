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
    const iatMs = new Date().getTime();
    const expMs = iatMs + tokenDuration;
    const iat = Math.floor(iatMs / 1000);
    const exp = Math.floor(expMs / 1000);
    const accessToken = await this.authService.generateAccessToken(user, {
      iat,
      exp,
    });

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return {
      id: user.id,
      accessToken: { value: accessToken, iat: iat * 1000, exp: exp * 1000 },
    };
  }

  @Get('logout')
  async logout(@Response({ passthrough: true }) response) {
    response.clearCookie('accessToken');
    return true;
  }
}
