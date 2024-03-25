import { Schema, model } from 'mongoose';
import { IColor } from './color.interface';

const colorSchema = new Schema({
  name: String,
  code: String,
  enable: { type: Boolean, default: true },
  deleted: { type: Boolean, default: true }
});

const ColorModel = model<IColor>('Color', colorSchema);

export default ColorModel;
