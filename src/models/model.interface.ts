import { Document } from 'mongoose';

export interface IModel extends Document {
  name: string;
  code: String,
  enable: boolean;
  deleted: boolean;
}
