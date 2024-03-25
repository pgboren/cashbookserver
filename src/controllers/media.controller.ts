import { Body, Post, Query , UploadedFile, UseInterceptors, Controller } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { MediaUploadService } from '../services/media/media.upload.service';

@Controller('/api/medias')
class MediaController  {

  constructor(protected readonly service: MediaUploadService) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async upload(@UploadedFile() file: Express.Multer.File
  , @Query('attach_document_name') attach_document_name: string
  ,@Query('attach_document_field') attach_document_field: string
  ,@Query('attach_document_id') attach_document_id: string
  ): Promise<any> {
    try {
      console.log(file);
        return this.service.create(file, attach_document_name, attach_document_field, attach_document_id);
    } catch (error) {
      throw error;
    }
  }
  
}

export { MediaController };



