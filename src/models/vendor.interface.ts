import { Document } from 'mongoose';
import { IColor } from './color.interface';
import { IModel } from './model.interface';
import { ICondition } from './condition.interface';
import internal from 'stream';

export interface IVendor extends Document {
  name: string;  
  tel: string;
  address: string;
  peningBalance: number;
  openingDate: Date;
}
