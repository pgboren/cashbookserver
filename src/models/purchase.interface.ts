import { Document } from 'mongoose';
import { IColor } from './color.interface';
import { IModel } from './model.interface';
import { ICondition } from './condition.interface';
import internal from 'stream';

export interface IPurhcase extends Document {
  no: string;  
  ref: string;
}
