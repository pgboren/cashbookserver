// role.model.ts
import { Schema, model } from 'mongoose';
import { IRole } from './role.interface';

const roleSchema = new Schema({
  name: String
});

const RoleModel = model<IRole>('Role', roleSchema);

export default RoleModel;
