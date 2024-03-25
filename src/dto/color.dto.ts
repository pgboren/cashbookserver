// user-create.dto.ts
import { IsNotEmpty, IsEmail, IsString, isNotEmpty, MaxLength, Validate } from 'class-validator';
import { BaseDto } from './base.dto';
import { UniqueUsernameValidator } from '../validator/UniqueUsernameValidator';
import { UniqueUserEmailValidator } from '../validator/UniqueUserEmailValidator';

export class ColorDto extends BaseDto {
  name: string;
  code: string;
  enable: boolean;
  deleted: boolean;
}
