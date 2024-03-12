import { IsEmail, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { CreateUserDto } from '../user/user.dto';

export class RegisterDto extends CreateUserDto {}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @Min(30000)
  tokenDuration: number;
}
