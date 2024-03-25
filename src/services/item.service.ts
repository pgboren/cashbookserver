import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { MediaUploadSupportServiceInterface } from './media/media.upload.suport.service.interface';
import { IMedia } from '../models/media.interface';
import ItemModel from '../models/item.model';

@Injectable()
class ItemService extends BaseService implements MediaUploadSupportServiceInterface {
    protected getModelDataFromRequest(param: any) {
      return {
        barcode: param.barcode,
        name: param.name,
        description: param.description,
        price: param.price,
        sold: param.sold,
        deleted: param.deleted
      };
    }

    constructor() {
      super(ItemModel);
    }

    public async attachedUploadedMedia(attach_document_field: string, id: string, media: IMedia) {
      // const user: IUser | null = await UserModel.findById(id).populate(this.getPopulation());
      // if (!user) {
      //   throw new Error('Document not found'); 
      // }
      // user.avatar = media;
      // user.save();
    }

    protected getPopulation(): string[] {
        return ['color'];
    }

    
}

export { ItemService };