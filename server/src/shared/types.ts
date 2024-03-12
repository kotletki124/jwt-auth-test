export interface Credentials {
  email: string;
  password: string;
}

export interface LoginDto extends Credentials {
  tokenDuration?: number;
}

export interface User {
  email: string;
  name: string;
  phone: string;
  address: string;
  bio: string;
}

export interface RegisterDto extends User {
  password: string;
}

export type UpdateUserDto = Omit<User, 'email'>;

export interface AuthStoreState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken?: {
    value: string;
    iat: number;
    exp: number;
  };
}

export interface Token {
  value: string;
  iat: number;
  exp: number;
}

export interface TokenPayload {
  sub: number;
  iat: number;
  exp: number;
}
