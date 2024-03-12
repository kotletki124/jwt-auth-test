import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './auth.dto';
import { User } from '../user/user.entity';
import 'dotenv/config';
import type { TokenPayload, Credentials } from 'src/shared/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    return this.userService.createUser(registerDto);
  }

  async validateCredentials(credentials: Credentials): Promise<User | null> {
    const { email, password } = credentials;
    const user = await this.userService.getUserBy(
      { email },
      { select: { id: true, password: true } },
    );
    if (await user?.comparePassword(password)) {
      return user;
    }
    return null;
  }

  async validateToken(token: string): Promise<TokenPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });
      return payload;
    } catch {
      return null;
    }
  }

  async generateAccessToken(
    user: User,
    payloadOverrides = {},
  ): Promise<string> {
    const payload = { sub: user.id, ...payloadOverrides };
    return this.jwtService.signAsync(payload);
  }
}
