import { Document } from 'mongoose';

interface IColor extends Document {
  name: string;
  code: string;
  enable: boolean;
  deleted: boolean;
}

export { IColor };