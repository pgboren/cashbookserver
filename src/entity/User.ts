import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import BaseEntity from './BaseEntity';
import { Media } from './Media';
import { Role } from './Role';

@Entity('users') // Specify the name of the table
class User extends BaseEntity {

  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'boolean', default: true })
  deletable: boolean;

  @OneToOne(() => Media, { nullable: true }) 
  @JoinColumn({ name: 'avatar_id' }) 
  avatar: Media;

  @ManyToMany(() => Role)
  @JoinTable()
  roles?: Role[];
  
  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedDate: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  deletedDate: Date;

}

export default User;
