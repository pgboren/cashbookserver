import { Entity, ObjectIdColumn, ObjectId , Column,CreateDateColumn, UpdateDateColumn } from 'typeorm';
import BaseEntity from './BaseEntity';

@Entity('media') // Specify the MongoDB collection name
export class Media extends BaseEntity {

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  size: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  mimetype: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  path: string;
}
