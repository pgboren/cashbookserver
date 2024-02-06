import { Document, model, Schema, SchemaTypes, CallbackError } from 'mongoose';
import { IUser } from './user.interface';

interface IUserAccessToken extends Document {
  user: IUser['_id'];
  token: string;
  type: string;
  active: boolean;
}

const UserAccessTokenSchema: Schema<IUserAccessToken> = new Schema(
  {
    user: { type: SchemaTypes.ObjectId, ref: 'User' },
    token: String,
    type: String,
    active: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const UserAccessTokenModel = model<IUserAccessToken>('UserAccessToken', UserAccessTokenSchema);

export { UserAccessTokenModel, IUserAccessToken };