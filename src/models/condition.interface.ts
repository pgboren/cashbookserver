import { Document } from 'mongoose';

export interface ICondition extends Document {
  name: string;
  code: String,
  enable: boolean;
  deleted: boolean;
}
