import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserAccessTokenModel } from '../models/user.accesstoken.model';
import UserModel from '../models/user.model';
import RoleModel from '../models/role.model';


class AuthJwtMiddleware {

  async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const secret: string = process.env.SECRET_KEY || '';
    const tokenValue: string = (req.headers["x-access-token"] || '').toString();
    if (!tokenValue) {
      res.status(403).send({ message: "No token provided!" });
      return;
    }

    UserAccessTokenModel.findOne({ token: tokenValue }).exec()
    .then(userAccessToken => {
      if (userAccessToken?.active) {

        jwt.verify(tokenValue, secret, (err: jwt.VerifyErrors | null, decoded: any) => {
          if (err) {
            if (err) {
               res.status(401).send({ message: "Unauthorized!" });
               return;
            }
          } else {
            console.log(decoded.id);
            req.params['userId'] = decoded.id;
            next();
          }
        });
      } else {
        res.status(401).send({ message: "Unauthorized!" });
        return;        
      }
    })
    .catch(error => {
       res.status(401).send({ message: "Unauthorized!" });
      return;
    });
  }



  async isAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await UserModel.findById(req.params['userId']);
        if (!user) {
            res.status(404).send({ message: "User not found." });
            return;
        }
        const roles = await RoleModel.find({ _id: { $in: user.roles } });
        if (roles.some(role => role.name === "admin")) {
            next();
        } else {
            res.status(403).send({ message: "Unauthorized!" });
        }
    } catch (error) {
        console.error("Error in isAdmin middleware:", error);
        res.status(500).send({ message: "Internal server error." });
    }
  }

  async isUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserModel.findById(req.params['userId']);
      if (!user) {
          res.status(404).send({ message: "User not found." });
          return;
      }
      const roles = await RoleModel.find({ _id: { $in: user.roles } });
      if (roles.some(role => role.name === "user")) {
          next();
      } else {
          res.status(403).send({ message: "Unauthorized!" });
      }
  } catch (error) {
      console.error("Error in isAdmin middleware:", error);
      res.status(500).send({ message: "Internal server error." });
  }
  }
}

export default AuthJwtMiddleware;