import express, { Request, Response } from 'express';
import { DataSource, EntityTarget, Repository, SelectQueryBuilder } from "typeorm";
import BaseEntity from '../entity/BaseEntity';
import { AppDataSource } from '../data-source';


abstract class EntityController<T extends BaseEntity> {

  protected target: EntityTarget<T>; 

  constructor(target: EntityTarget<T>) {
    this.target = target;
  }

  protected abstract createSelectQuery(): SelectQueryBuilder<T>;

  public all = async (req: Request, res: Response): Promise<void> => {
    try {
      const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
      };
      const skip = (options.page - 1) * options.limit;
      const entities = await this.createSelectQuery().getMany();
      res.status(200).json({
        docs: entities,
        totalItems: 0,
        limit: options.limit,
        currentPage: options.page,
        totalPages: 1,
        hasNextPage: false,
        nextPage: 0,
        hasPrevPage: false,
        prevPage: 0,
        pagingCounter: 1
      });
      
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

 
}
export { EntityController };