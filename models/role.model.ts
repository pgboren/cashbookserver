// role.model.ts
import { Document, Schema, model, PaginateModel, SchemaTypes, CallbackError } from 'mongoose';
import { IRole } from './role.interface';

const roleSchema = new Schema({
  name: String
});

const RoleModel = model<IRole>('Role', roleSchema);

export default RoleModel;
