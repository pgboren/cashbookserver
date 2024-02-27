import { PaginateModel } from 'mongoose';
import { Get, Body, Delete, Param,Put, Patch, Post, Req, Query, UseInterceptors, BadRequestException, HttpStatus, HttpException  } from '@nestjs/common';
import { BaseService } from '../services/base.service';
import { FileUploadService } from '../services/file.upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseDto } from '../dto/base.dto';
import { UserCreateDto } from '../dto/user.dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { DtoValidationError } from '../dto/validation.error';


abstract class BaseController  {

  constructor(protected readonly service: BaseService, private readonly fileUploadService: FileUploadService) {
  }

  protected abstract transformToDto(data: any): BaseDto;

  private async validateDto(dto: BaseDto): Promise<void> {
    const errors: ValidationError[] = await validate(dto);
    if (errors.length > 0) {
      let valErrors: DtoValidationError[] = [];
      errors.forEach(error => {
        const valError: DtoValidationError = new DtoValidationError();
        valError.property = error.property;
        valError.value = error.value;
        valError.constraints = error.constraints;
        valErrors.push(valError);
      });
      throw new BadRequestException(valErrors);
    }
  }

  @Patch(':id')
  public async patch(@Param('id') id: string, @Body() data: any): Promise<any> {
    try {
      const userDto: BaseDto = this.transformToDto(data);
      return await this.service.update(id, userDto);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  public async put(@Param('id') id: string, @Body() data: any): Promise<any> {
    try {
      const dto: BaseDto = this.transformToDto(data);
      dto._id = id;
      await this.validateDto(dto);
      return await this.service.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<any> {
    try {
      await this.service.remove(id);
      return { message: 'Resource deleted successfully.' };
    } catch (error) {
      // if (error instanceof YourCustomError) {
      //   throw new HttpException({ message: 'Failed to delete resource.', error: error.message }, HttpStatus.BAD_REQUEST);
      // }
      throw new HttpException({ message: 'Internal server error.', error: 'Failed to delete resource.' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  public async post(@Body() data: any): Promise<any> {
    try {
      const userDto: BaseDto = this.transformToDto(data);
      await this.validateDto(userDto);
      return await this.service.create(userDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  public async get(@Param('id') id: string): Promise<any> {
    return await this.service.get(id);
  };

  @Get()
  public async all(@Query() query: any): Promise<any> {0    
    return await this.service.findAll(query);
  };

}

export { BaseController };



// @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // public async post(@UploadedFile() file: Express.Multer.File, @Body() data: any): Promise<any> {
  //   try {
  //     const userDto: BaseDto = this.transformToDto(data);
  //     await this.validateDto(userDto);
  //     // if (file != null) {
  //     //   await this.fileUploadService.uploadFile(file);
  //     // }
  //     return await this.service.create(userDto);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  