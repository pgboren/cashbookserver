// user-create.dto.ts
import { IsNotEmpty, IsEmail, IsString, isNotEmpty, MaxLength, Validate } from 'class-validator';
import { BaseDto } from './base.dto';
import { UniqueUsernameValidator } from '../validator/UniqueUsernameValidator';
import { UniqueUserEmailValidator } from '../validator/UniqueUserEmailValidator';

export class UserCreateDto extends BaseDto {

  @IsNotEmpty()
  @IsString()
  @Validate(UniqueUsernameValidator)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueUserEmailValidator)
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  roles: string[];

  enable: boolean;
  
}
