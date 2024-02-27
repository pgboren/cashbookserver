import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import UserModel from '../models/user.model';
import { IUser } from '../models/user.interface';
import { UserCreateDto } from '../dto/user.dto';

@ValidatorConstraint({ name: 'uniqueUsername', async: true })
@Injectable()
export class UniqueUsernameValidator implements ValidatorConstraintInterface {

    async validate(value: any, args?: ValidationArguments | undefined): Promise<boolean> {
        const username = value;
        const existingUser = await UserModel.findOne({username: value});
        if (!existingUser) {
            return true;
        }
  
        const userToUpdate = args?.object as UserCreateDto;
        return existingUser._id == userToUpdate._id;

        
    }
    defaultMessage?(validationArguments?: ValidationArguments | undefined): string {
        return 'Username is already in use.';
    }

}