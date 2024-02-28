import UserModel    from "../models/user.model";
import { Controller, Inject } from '@nestjs/common';
import { BaseController } from "./base.controller";
import { UserService } from "../services/user.service";
import { FileUploadService } from "../services/file.upload.service";
import { UserCreateDto } from "../dto/user.dto";
import { Get, Body, Post, Req, Query, UploadedFile, UseInterceptors, BadRequestException  } from '@nestjs/common';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseDto } from "../dto/base.dto";

@Controller('/api/users')
class UserController extends BaseController {
  
  constructor(@Inject(UserService) userService: UserService, @Inject(FileUploadService) fileUploadService: FileUploadService) {
    super(userService,fileUploadService);
  }

  @Get('/check-email-exists')
  public async checkEmailExists(@Query('email') email: string, @Query('id') id?: string): Promise<any> {
    let userService: UserService = this.service as UserService;
    const emailExists = await userService.checkEmailExists(email, id);
    return { exist: emailExists};
  }

  protected transformToDto(data: any): BaseDto {
    const user:UserCreateDto = new UserCreateDto();
    user.username = data.username;
    user.email = data.email;
    user.password = data.password;
    user.roles = data.roles;
    user.enable = data.enable;
    return user;
  }
   
}

export { UserController };
