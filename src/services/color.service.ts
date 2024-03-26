import { Get, Post, Query, Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import ColorModel from '../models/color.model';
import { RefDocService } from './refdoc.service';

@Injectable()
class ColorService extends RefDocService {

    constructor() {
      super(ColorModel);
    }    
}

export { ColorService };