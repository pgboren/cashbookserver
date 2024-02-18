import { PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

class BaseEntity {

    @PrimaryColumn('uuid')
    id: string = uuid();
  
}

export default BaseEntity;
