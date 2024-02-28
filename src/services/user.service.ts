import { Get, Post, Query, Injectable } from '@nestjs/common';
import UserModel from '../models/user.model';
import { BaseService } from './base.service';
import { IUser } from '../models/user.interface';

@Injectable()
class UserService extends BaseService {

    constructor() {
      super(UserModel);
    }

    protected getPopulation(): string[] {
        return ['roles'];
    }

    public async checkEmailExists(email: string, id: string | undefined): Promise<boolean> {

      interface QueryType {
        email: string;
        deleted: boolean;
        _id?: { $ne: string };
      }

      let query: QueryType = { email: email, deleted: false };
      if (id) {
        query._id = { $ne: id };
      }
      let users: IUser[] = await UserModel.find(query);
      return users.length > 0;
    }

    public async checkUserNameExists(username: string, id: string | undefined): Promise<boolean> {

      interface QueryType {
        username: string;
        deleted: boolean;
        _id?: { $ne: string };
      }

      let query: QueryType = { username: username, deleted: false };

      if (id) {
        query._id = { $ne: id };
      }
      let users: IUser[] = await UserModel.find(query);
      return users.length > 0;
    }


    protected getModelDataFromRequest(param: any): any {
      return {
        username: param.username ,
        email: param.email,
        password: param.password,
        deletable: false
        };
    }

    protected formatDocs(docs: any[]): any[] {
      return docs.map(user => ({
        _id: user._id,
        username: user.username,
        email: user.email,
        deleted: user.deleted,
        deletable: user.deletable,
        roles: user.roles
      }));
    }
    
}

export { UserService };