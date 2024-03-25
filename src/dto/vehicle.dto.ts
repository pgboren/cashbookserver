// user-create.dto.ts
import { IsNotEmpty, IsEmail, IsString, isNotEmpty, MaxLength, Validate } from 'class-validator';
import { BaseDto } from './base.dto';
import { UniqueUsernameValidator } from '../validator/UniqueUsernameValidator';
import { UniqueUserEmailValidator } from '../validator/UniqueUserEmailValidator';

export class ItemDto extends BaseDto {
  barcode: String;
  name: string;  
  description: string;
  price: number;
  deleted: boolean;  
}
