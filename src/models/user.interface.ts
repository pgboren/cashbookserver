import { Document } from 'mongoose';
import { IRole } from './role.interface';
import { IMedia } from './media.interface';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  deletable: boolean;
  enable: boolean;
  avatar: IMedia['_id'] | null;
  roles: IRole['_id'][];
  deleted: boolean;
}
