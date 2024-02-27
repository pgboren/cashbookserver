// role.model.ts
import { Document } from 'mongoose';

interface IMedia extends Document {
  name: string;
  size: number;
  mimetype: string;
  created: Date;
  updated?: Date;
  path: string;
}

export  { IMedia };