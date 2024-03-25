import { Document } from 'mongoose';
import { IColor } from './color.interface';
import { IModel } from './model.interface';
import { ICondition } from './condition.interface';

export interface IItem extends Document {
  barcode: String;
  name: string;  
  description: string;
  price: number;
  deleted: boolean;
}
