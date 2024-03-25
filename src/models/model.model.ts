import { Schema, model } from 'mongoose';
import { IColor } from './color.interface';
import { CallbackError } from 'mongoose';
import { IModel } from './model.interface';

const modelSchema = new Schema({
  name: String,
  code: String,
  enable: { type: Boolean, default: true },
  deleted: { type: Boolean, default: true }
});

modelSchema.pre<IModel>('save', async function (next) {
  const model = this;
  try {
    if (model.deleted) {
      throw new Error('Cannot update a color object that has been deleted.');
    }
    model.deleted = false;
    next();
  } catch (error: unknown) {
    return next(error as CallbackError);
  }
});

const ModelModel = model<IModel>('Model', modelSchema);

export default ModelModel;
