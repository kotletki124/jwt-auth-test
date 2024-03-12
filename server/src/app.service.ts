import { Injectable } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
import { UserService } from './modules/user/user.service';
import { injectStateIntoHtml } from './util';
import type { AuthStoreState } from './shared/types';

@Injectable()
export class AppService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async getInitialState(accessToken: string): Promise<AuthStoreState> {
    const authState: AuthStoreState = {
      isAuthenticated: false,
      user: null,
    };
    if (accessToken) {
      const payload = await this.authService.validateToken(accessToken);
      const id = payload?.sub;
      if (id) {
        const user = await this.userService.getUserBy({ id });
        if (user)
          Object.assign(authState, {
            isAuthenticated: true,
            id,
            user,
            accessToken: {
              ...payload,
              iat: payload.iat * 1000,
              exp: payload.exp * 1000,
            },
          });
      }
    }
    return authState;
  }

  injectInitialStateIntoHtml(
    htmlString: string,
    state: AuthStoreState,
  ): string {
    return injectStateIntoHtml(htmlString, state);
  }
}
