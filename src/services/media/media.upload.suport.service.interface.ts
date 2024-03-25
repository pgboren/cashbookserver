import { Get, Post, Query, Injectable } from '@nestjs/common';
import { IMedia } from '../../models/media.interface';

interface MediaUploadSupportServiceInterface {

  attachedUploadedMedia(attach_document_field: string, document: string, media: IMedia): any;    

}

export { MediaUploadSupportServiceInterface };