import { Express } from 'express';
import AuthController from '../controllers/auth.controller';

export default function (app: Express): void {
  const controller = new AuthController();
  app.post("/api/auth/signup", controller.signup);
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout", controller.signout);
  app.post("/api/auth/refresh", controller.refresh);
  app.get('/api/auth/verify/:token', controller.verify);
  app.post("/api/auth/set_profile_picture", controller.setProfilePicture);
}
