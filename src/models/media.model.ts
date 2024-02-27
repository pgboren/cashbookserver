import { Document, Schema, model, PaginateModel, SchemaTypes, CallbackError } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IMedia } from './media.interface';

const mediaSchema = new Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
  path: { type: String, required: true },
});

mediaSchema.plugin(mongoosePaginate);


const MediaModel: PaginateModel<IMedia> = model<IMedia>('Media', mediaSchema) as PaginateModel<IMedia>;

export default MediaModel;