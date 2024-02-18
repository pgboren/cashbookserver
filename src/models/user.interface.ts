import { Document } from 'mongoose';
import { Media } from './media.model';  // Adjust import paths based on your project structure
import { IRole } from './role.interface';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  deletable: boolean;
  avatar: Media['_id'] | null;
  roles: IRole['_id'][];
  deleted: boolean;
}

export { IUser };