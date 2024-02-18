import { Entity, Column, ManyToOne} from 'typeorm';
import BaseEntity from "./BaseEntity";
import User from './User';

@Entity()
class UserAccessToken extends BaseEntity {

    @ManyToOne(() => User, { cascade:["remove"]}) 
    user: User;

    @Column()
    token: string;

    @Column()
    type: string;

    @Column()
    active: boolean;

}

export default UserAccessToken;