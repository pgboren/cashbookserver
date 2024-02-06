import express, { Request, Response } from 'express';
import { PaginateModel } from 'mongoose';


abstract class BaseController {

  protected Model: PaginateModel<any>; 
  
  constructor(model: PaginateModel<any>) {
    this.Model = model;
  }

  protected abstract formatDocs(docs: any[]): any[];

  public all = async (req: Request, res: Response): Promise<void> => {
    try {
      const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        collation: {
          locale: 'en',
        },
      };
      const result = await this.Model.paginate({}, options);
      const formattedDocs:any[] = this.formatDocs(result.docs);
      res.status(200).json({
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
      });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

}

export { BaseController };