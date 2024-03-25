import { Schema, model } from 'mongoose';
import { CallbackError } from 'mongoose';
import { ICondition } from './condition.interface';

const conditionSchema = new Schema({
  name: String,
  code: String,
  enable: { type: Boolean, default: true },
  deleted: { type: Boolean, default: true }
});

conditionSchema.pre<ICondition>('save', async function (next) {
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

const ConditionModel = model<ICondition>('Condition', conditionSchema);

export default ConditionModel;
