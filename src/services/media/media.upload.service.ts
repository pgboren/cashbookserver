// file-upload.service.ts
import { Injectable, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IMedia } from '../../models/media.interface';
import { StringUtils } from '../../utils/StringUtils';
import MediaModel from '../../models/media.model';
import { UserService } from '../user.service';
import { ModuleRef, NestContainer, Reflector } from '@nestjs/core';
import { MediaUploadSupportServiceInterface } from './media.upload.suport.service.interface';

@Injectable()
export class MediaUploadService {

  constructor(
    private readonly moduleRef: ModuleRef, 
    private readonly reflector: Reflector

  ) {}
  
  async create(@UploadedFile() file: Express.Multer.File, 
  attach_document_name: string, 
  attach_document_field: string,
  attach_document_id: string,): Promise<IMedia> {
    const { filename, size, mimetype, path} = file;
    var logicalPath = StringUtils.replaceAll(path, '\\', '/');
    logicalPath = StringUtils.replaceAll(logicalPath, 'public/', '');
    const media: IMedia = await MediaModel.create({
      name: filename,
      size: size,
      mimetype: mimetype,
      path: logicalPath
    });

    const mediaUploadSupportService: MediaUploadSupportServiceInterface | null = this.getMediaUploadSupportService(attach_document_name)
    if (mediaUploadSupportService) {
      mediaUploadSupportService.attachedUploadedMedia(attach_document_field, attach_document_id, media);
    }
    
    return media;
  }

  getMediaUploadSupportService(doc_name: string): MediaUploadSupportServiceInterface | null {
    if (doc_name == 'user') {
      return this.moduleRef.get(UserService);
    }
    return null;
  }

}