import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.accessToken;
    if (!token) throw new UnauthorizedException();
    const payload = await this.authService.validateToken(token);
    if (!payload?.sub) throw new UnauthorizedException();
    request['user'] = payload;
    return true;
  }
}
