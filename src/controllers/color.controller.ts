import { Controller, Inject } from '@nestjs/common';
import { BaseController } from "./base.controller";
import { MediaUploadService } from "../services/media/media.upload.service";
import { BaseDto } from "../dto/base.dto";
import { ColorService } from "../services/color.service";
import { ColorDto } from "../dto/color.dto";

@Controller('/api/colors')
class ColorController extends BaseController {
  
  constructor(@Inject(ColorService) colorService: ColorService) {
    super(colorService);
  }

  protected transformToDto(data: any): BaseDto {
    const color:ColorDto = new ColorDto();
    color.name = data.name;
    color.code = data.code;
    color.enable = data.enable;
    color.deleted = data.deleted;
    return color;
  }
   
}

export { ColorController };
