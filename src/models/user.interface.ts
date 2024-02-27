import { Document } from 'mongoose';
import { IRole } from './role.interface';
import { IMedia } from './media.interface';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  deletable: boolean;
  avatar: IMedia['_id'] | null;
  roles: IRole['_id'][];
  deleted: boolean;
}

export { IUser };