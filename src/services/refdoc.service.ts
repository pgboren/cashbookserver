import { Query } from '@nestjs/common';
import { BaseService } from './base.service';
import { Model } from 'mongoose';

abstract class RefDocService extends BaseService {

  constructor(model: Model<any>) {
    if (!model) {
      throw new Error('Model is required');
    }
    super(model);
  }

  getModelDataFromRequest({name}: any): { name: string } {
    return { name };
  }

  protected getPopulation(): string[] {
    return [];
  }

  protected formatDocs(docs: Array<{_id: string, name: string, code?: string}>): Array<{_id: string, name: string, code?: string}> {
    return docs.map(({_id, name, code}) => ({_id, name, code}));
  }

  async findAll({query}: {query: any}): Promise<{docs: Array<{_id: string, name: string, code?: string}>}> {
    try {
      const docs = await this.model.find(query);
      return {docs};
    } catch (err) {
      throw err;
    }
  }
  
}

export { RefDocService };