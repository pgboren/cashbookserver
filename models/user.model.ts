import bcrypt from 'bcryptjs';
import { Document, Schema, model, PaginateModel, SchemaTypes, CallbackError } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { Media, MediaModel } from './media.model';
import { IUser } from './user.interface';
import './role.model';

export const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    deletable: { type: Boolean, default: true },
    avatar: { type: SchemaTypes.ObjectId, ref: 'Media' },
    roles: [
      {
        type:  SchemaTypes.ObjectId,
        ref: 'Role',
      },
    ],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);

// Middleware to hash the password before saving
userSchema.pre<IUser>('save', async function (next) {
  const user = this;

  // Only hash the password if it has been modified or is new
  if (!user.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password along with the new salt
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Replace the plain password with the hashed one
    user.password = hashedPassword;
    next();
  } catch (error: unknown) {
    return next(error as CallbackError);
  }
});

const UserModel: PaginateModel<IUser> = model<IUser>('User', userSchema) as PaginateModel<IUser>;

export default UserModel;
