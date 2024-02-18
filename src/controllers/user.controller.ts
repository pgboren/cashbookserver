import UserModel    from "../models/user.model";
import { BaseController } from "./base.controller";

class UserController extends BaseController {
  
  constructor() {
    super(UserModel);
  }
  
  protected formatDocs(docs: any[]): any[] {
    return docs.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email
    }));
  }

}

export { UserController };
