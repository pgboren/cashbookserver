// file-upload.service.ts
import { Injectable, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IMedia } from '../models/media.interface';
import { StringUtils } from '../utils/StringUtils';
import MediaModel from '../models/media.model';

@Injectable()
export class FileUploadService {
  
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<IMedia> {
    const { filename, size, mimetype, path} = file;
    var logicalPath = StringUtils.replaceAll(path, '\\', '/');
    logicalPath = StringUtils.replaceAll(logicalPath, 'public/', '');
    const media: IMedia = await MediaModel.create({
      name: filename,
      size: size,
      mimetype: mimetype,
      path: logicalPath
    });
    return media;
  }

}