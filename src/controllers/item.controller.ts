import { Controller, Inject } from '@nestjs/common';
import { BaseController } from "./base.controller";
import { UserCreateDto } from "../dto/user.dto";
import { BaseDto } from "../dto/base.dto";
import { ItemService } from '../services/item.service';
import { ItemDto } from '../dto/vehicle.dto';

@Controller('/api/items')
class ItemController extends BaseController {
  
  constructor(@Inject(ItemService) protected readonly service: ItemService) {
    super(service);
  }

  protected transformToDto(data: any): BaseDto {
    const item:ItemDto = new ItemDto();
    item.name = data.name;
    item.barcode = data.barcode;
    item.description = data.description;
    item.price = data.price;
    item.deleted = false;
    return item;
  }
   
}

export { ItemController };
