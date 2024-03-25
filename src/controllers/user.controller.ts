import { Controller, Inject } from '@nestjs/common';
import { BaseController } from "./base.controller";
import { UserService } from "../services/user.service";
import { UserCreateDto } from "../dto/user.dto";
import { Get, Query  } from '@nestjs/common';
import { BaseDto } from "../dto/base.dto";

@Controller('/api/users')
class UserController extends BaseController {
  
  constructor(@Inject(UserService) protected readonly service: UserService) {
    super(service);
  }

  @Get('/check-email-exists')
  public async checkEmailExists(@Query('email') email: string, @Query('id') id?: string): Promise<any> {
    let userService: UserService = this.service as UserService;
    const emailExists = await userService.checkEmailExists(email, id);
    return { exist: emailExists};
  }

  @Get('/check-username-exists')
  public async checkUserNameExists(@Query('username') username: string, @Query('id') id?: string): Promise<any> {
    let userService: UserService = this.service as UserService;
    const emailExists = await userService.checkUserNameExists(username, id);
    return { exist: emailExists};
  }

  protected transformToDto(data: any): BaseDto {
    const user:UserCreateDto = new UserCreateDto();
    user.username = data.username;
    user.email = data.email;
    user.password = data.password;
    user.roles = data.roles;
    user.enable = data.enable;
    user.deletable = data.deletable;
    return user;
  }
   
}

export { UserController };
