import { Express } from 'express';
import { UserController } from '../controllers/user.controller';
import AuthJwtMiddleware from '../middlewares/AuthJwtMiddleware';

export default function (app: Express): void {
  const userController = new UserController();
  const authJwtMiddleware = new AuthJwtMiddleware();
  app.get("/api/users" , userController.all);

  // [authJwtMiddleware.verifyToken, authJwtMiddleware.isAdmin]
}
