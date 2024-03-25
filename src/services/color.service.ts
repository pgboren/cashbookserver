import { Get, Post, Query, Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import ColorModel from '../models/color.model';

@Injectable()
class ColorService extends BaseService {

    constructor() {
      super(ColorModel);
    }

    protected getModelDataFromRequest(param: any): any {
      return { name: param.name};
    }

    protected getPopulation(): string[] {
      return [];
  }  

    protected formatDocs(docs: any[]): any[] {
      return docs.map(color => ({
        _id: color._id,
        name: color.name,
        code: color.code
      }));
    }

    async findAll(@Query() query: any): Promise<any> {
      try {
          const docs = await this.Model.find({});
          return {
            docs: docs
          };
        } catch (err) {
          throw err;
        }
  }
    
}

export { ColorService };