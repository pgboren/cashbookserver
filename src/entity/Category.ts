import { Entity, ObjectId , Column } from 'typeorm';
import BaseEntity from './BaseEntity';

@Entity('categories')
export class Category extends BaseEntity {
  
    @Column()
    name!: string

}
