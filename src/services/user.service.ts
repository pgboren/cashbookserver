import { Get, Post, Query, Injectable } from '@nestjs/common';
import UserModel from '../models/user.model';
import { BaseService } from './base.service';
import { IUser } from '../models/user.interface';
import { MediaUploadSupportServiceInterface } from './media/media.upload.suport.service.interface';
import { IMedia } from '../models/media.interface';

@Injectable()
class UserService extends BaseService implements MediaUploadSupportServiceInterface {
  
    constructor() {
      super(UserModel);
    }

    public async attachedUploadedMedia(attach_document_field: string, id: string, media: IMedia) {
      const user: IUser | null = await UserModel.findById(id).populate(this.getPopulation());
      if (!user) {
        throw new Error('Document not found'); 
      }
      user.avatar = media;
      user.save();
    }

    protected getPopulation(): string[] {
        return ['roles', 'avatar'];
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