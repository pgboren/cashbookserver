import { Query, ConflictException } from '@nestjs/common';
import UserModel from '../models/user.model';
import { PaginateModel, Model } from 'mongoose';
import { MongoError } from 'mongodb';

abstract class BaseService {

    protected Model: Model<any>;
  
    constructor(model: Model<any>) {
        this.Model = model;
    }

    protected formatDocs(docs: any[]): any[] {
        return docs;    
    }

    protected abstract getModelDataFromRequest(param: any): any;

    protected abstract getPopulation(): string[];

    async get(id: string): Promise<Document> {
      const doc = await this.Model.findById(id).populate(this.getPopulation());
      if (!doc) {
        throw new Error('Document not found'); 
      }
      return doc;
    }

    async remove(id: string) : Promise<void> {
       await this.Model.remove({ _id: id});
    }

    async update(id: string, data: any) : Promise<Document> {
      let updateDoc = await this.Model.findOneAndUpdate({ _id: id}, data, {
        new: true
      });
      return updateDoc;
    }

    async create(param: any): Promise<Document> {
      const createdDoc = await this.Model.create(param);
      return createdDoc;
    }

    async findAll(@Query() query: any): Promise<any> {
        try {
            const options = {
              page: Number(query.page) || 1,
              limit: Number(query.limit) || 10,
              collation: {
                locale: 'en',
              },
              populate: 'roles',
              sort: {}
            };

            if (query.sort && query.order) {
              const sortOrder = query.order.toLowerCase() === 'desc' ? -1 : 1;
              options.sort = { [query.sort]: sortOrder };
            }

            const result = await (this.Model as PaginateModel<any>).paginate({}, options);
            const formattedDocs:any[] = this.formatDocs(result.docs);
            return {
              docs: formattedDocs,
              totalItems: result.totalDocs,
              limit: result.limit,
              currentPage: result.page,
              totalPages: result.totalPages,
              hasNextPage: result.hasNextPage,
              nextPage: result.nextPage,
              hasPrevPage: result.hasPrevPage,
              prevPage: result.prevPage,
              pagingCounter: result.pagingCounter
            };
      
          } catch (err) {
            throw err;
          }
    }

}


export { BaseService };