import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {UserAccessTokenModel, IUserAccessToken} from '../models/user.accesstoken.model';
import UserModel from '../models/user.model';
import RoleModel from '../models/role.model';
import { QueryWithHelpers } from 'mongoose';

class AuthController {

  constructor() {
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const user = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      user.save(async (err, savedUser) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (req.body.roles) {
          const roles = await RoleModel.find({ name: { $in: req.body.roles } });

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: 'User was registered successfully!' });
          });
        } else {
          const defaultRole = await RoleModel.findOne({ name: 'user' });
          
          user.roles = [defaultRole?._id];
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: 'User was registered successfully!' });
          });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  public verify(req: Request, res: Response): void {
    const token: string = req.params.token;
    const secret: string = process.env.SECRET_KEY || '';
    jwt.verify(token, secret, (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(401).json({ error: 'Token has expired' });
        } else {
          res.status(500).json({ error: 'Error verifying token' });
        }
      } else {
        res.json({ message: 'Token is valid', decoded });
      }
    });
  }

  public refresh(req: Request, res: Response): void {
    const refreshToken: string = req.body.refreshToken;
    const secret: string = process.env.SECRET_KEY || '';

    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(refreshToken, secret, (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const user: { id: string } = decoded as { id: string }; // Assuming user has an id property
      const newAccessToken: string = jwt.sign({ id: user.id }, secret, { expiresIn: '1d' });
      const newRefreshToken: string = jwt.sign({ id: user.id }, secret, { expiresIn: '15d' });

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  }

  async signout(req: Request, res: Response): Promise<void> {
    const accessToken = req.headers['x-access-token'] as string;
    const refreshToken = req.headers['x-refresh-token'] as string;
  
    if (!accessToken) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  
    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' });
    }
    
    await UserAccessTokenModel.findOneAndUpdate({ token: accessToken }, { active: false }, { upsert: true }).exec();
    await UserAccessTokenModel.findOneAndUpdate({ token: refreshToken }, { active: false }, { upsert: true }).exec();
  
    res.json({ message: 'Logout successful' });
  };

  async signin(req: Request, res: Response): Promise<void> {
    try {
      const secret: string = process.env.SECRET_KEY || '';
      const adminUsername = 'admin';
      const adminEmail = 'admin@gmail.com';
      const adminPassword = 'admin';
      
      const userAgent = req.headers['user-agent'];
      const user = await UserModel.findOne({
        username: req.body.username,
      }).select('+password').populate('roles');

      if (!user) {
        res.status(404).send({ message: 'User Not found.' });
        return;
      }

      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
        return;
      }

      await UserAccessTokenModel.updateMany({ user: user._id, active: true }, { $set: { active: false } });

      const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1d' });
      const refreshToken = jwt.sign({ id: user.id }, secret, { expiresIn: '15d' });

      const accessToken = new UserAccessTokenModel({
        user: user._id,
        token: token,
        type: 'ACCESSTOKEN',
        active: true,
      });

      await accessToken.save();

      const refreshTokenObject = new UserAccessTokenModel({
        user: user._id,
        token: refreshToken,
        type: 'REFRESHTOKEN',
        active: true,
      });

      await refreshTokenObject.save();
      const authorities: string[] = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);
      const authData = {
        username: user.username,
        avatar: user.avatar ? user.avatar.path : null,
        email: user.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
      };
       res.status(200).send(authData);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async setProfilePicture(req: Request, res: Response): Promise<void> {
    try {
      const user_id: string = req.body.user_id;
      const user_picture: string = req.body.picture;

      // Update the user's avatar
      const updateResult = await UserModel.updateOne({ _id: user_id }, { $set: { avatar: user_picture } });
      
      // if (updateResult.nModified === 0) {
      //   // If no documents were modified, the user with the given _id was not found
      //   res.status(404).json({ error: 'User not found' });
      // }

      // Fetch the updated user document
      const updatedUser = await UserModel.findById(user_id, { _id: 1, username: 1, avatar: 1 });

      // Send the updated user in the response
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AuthController;
