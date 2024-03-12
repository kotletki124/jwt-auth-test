import {
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
  IsNumber,
  IsString,
} from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';

export class CheckEmailDto {
  @IsEmail()
  email: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(30)
  password: string;

  @MinLength(2)
  @MaxLength(30)
  name: string;

  @Matches(/^[0-9]{10}$|^$/)
  phone: string;

  @IsString()
  address: string;

  @IsString()
  bio: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password'] as const),
) {}

export class GetUserByDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  @IsOptional()
  @IsNumber()
  id?: number;
}
