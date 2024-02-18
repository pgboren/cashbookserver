// role.model.ts
import { Document, Schema, model, PaginateModel, SchemaTypes, CallbackError } from 'mongoose';

interface IRole extends Document {
  name: string;
  // Other role properties as needed
}

export  { IRole };
