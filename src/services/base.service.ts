import { Query, HttpException, HttpStatus } from '@nestjs/common';
import { PaginateModel, Model } from 'mongoose';
import "reflect-metadata"

abstract class BaseService {

    protected model: Model<any>;
  
    constructor(model: Model<any>) {
        this.model = model;
    }

    protected formatDocs(docs: any[]): any[] {
    
        return docs;    
    }

    protected abstract getModelDataFromRequest(param: any): any;

    protected abstract getPopulation(): string[];

    async get(id: string): Promise<Document> {
      const doc = await this.model.findById(id).populate(this.getPopulation());
      if (!doc) {
        throw new Error('Document not found'); 
      }
      return doc;
    }

    async remove(id: string) : Promise<void> {
       await this.model.remove({ _id: id});
    }

    async update(id: string, data: any) : Promise<Document> {

      const existingDoc = await this.get(id);
      if (!existingDoc) {
        throw new Error('Document not found');
      }

     if ('deleted' in existingDoc) {
      const isDeleted: boolean = Reflect.get(existingDoc, 'deleted') as boolean;
      if (isDeleted) {
        throw new HttpException('Cannot update this object that has been marked as deleted.', HttpStatus.FORBIDDEN);
      }
     }
    
     const updateData = { $set: data };
      let updateDoc: Document = await this.model.findOneAndUpdate({ _id: id}, updateData, {new: true});
      return updateDoc;
    }

    async create(param: any): Promise<Document> {
      const createdDoc = await this.model.create(param);
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
              populate: this.getPopulation(),
              sort: {}
            };

            

            if (query.sort && query.order) {
              const sortOrder = query.order.toLowerCase() === 'desc' ? -1 : 1;
              options.sort = { [query.sort]: sortOrder };
            }

            const result = await (this.model as PaginateModel<any>).paginate({}, options);
            const formattedDocs:any[] = this.formatDocs(result.docs);
            return {
              docs: result.docs,
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