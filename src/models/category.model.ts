import { Document, Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ICategory } from './category.interface';

const categorySchema = new Schema({
  name: String,
  code: String,
  enable: { type: Boolean, default: true },
  deleted: { type: Boolean, default: true }
});

categorySchema.plugin(mongoosePaginate);

const CategoryModel: PaginateModel<ICategory> = model<ICategory>('Category', categorySchema) as PaginateModel<ICategory>;

export default CategoryModel;