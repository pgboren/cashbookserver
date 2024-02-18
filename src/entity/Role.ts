import { Entity, PrimaryGeneratedColumn, ObjectId , Column } from 'typeorm';
import BaseEntity from './BaseEntity';

@Entity('roles')
export class Role extends BaseEntity {
  
    @Column()
    name!: string

}
