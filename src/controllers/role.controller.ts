import UserModel    from "../models/user.model";
import { Controller, Inject } from '@nestjs/common';
import { BaseController } from "./base.controller";
import { UserService } from "../services/user.service";
import { MediaUploadService } from "../services/media/media.upload.service";
import { UserCreateDto } from "../dto/user.dto";
import { Get, Body, Post, Req, Query, UploadedFile, UseInterceptors, BadRequestException  } from '@nestjs/common';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseDto } from "../dto/base.dto";
import { RoleService } from "../services/role.service";

@Controller('/api/roles')
class RoleController extends BaseController {
  
  constructor(@Inject(RoleService) userService: RoleService) {
    super(userService);
  }

  protected transformToDto(data: any): BaseDto {
    const user:UserCreateDto = new UserCreateDto();
    user.username = data.username;
    user.email = data.email;
    user.password = data.password;
    user.roles = data.roles;
    return user;
  }
   
}

export { RoleController };
