import { Get, Post, Query, Injectable } from '@nestjs/common';
import UserModel from '../models/user.model';
import { BaseService } from './base.service';
import RoleModel from '../models/role.model';

@Injectable()
class RoleService extends BaseService {

    constructor() {
      super(RoleModel);
    }

    protected getModelDataFromRequest(param: any): any {
      return { name: param.name};
    }

    protected getPopulation(): string[] {
      return [];
  }  

    protected formatDocs(docs: any[]): any[] {
      return docs.map(role => ({
        _id: role._id,
        name: role.name,
      }));
    }

    async findAll(@Query() query: any): Promise<any> {
      try {
          const docs = await this.model.find({});
          return {
            docs: docs
          };
        } catch (err) {
          throw err;
        }
  }
    
}

export { RoleService };