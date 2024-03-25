import { IColor } from './color.interface';
import { IItem } from './item.interface';
import mongoosePaginate from 'mongoose-paginate-v2';
import {  Schema, model, SchemaTypes, CallbackError } from 'mongoose';

const itemSchema = new Schema({
  barcode: String,
  name: String,
  description: String,
  price: Number,
  deleted: Boolean
});

itemSchema.plugin(mongoosePaginate);

const ItemModel = model<IItem>('Item', itemSchema);

export default ItemModel;
