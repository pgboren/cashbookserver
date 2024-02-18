import { Schema, Document, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

interface Media extends Document {
  name: string;
  size: number;
  mimetype: string;
  created: Date;
  updated?: Date;
  path: string;
}

const mediaSchema = new Schema<Media>({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
  path: { type: String, required: true },
});

mediaSchema.plugin(mongoosePaginate);

const MediaModel = model<Media>('Media', mediaSchema);

export { MediaModel, Media };
