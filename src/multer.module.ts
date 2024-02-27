// multer.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: './public/uploads/', 
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, './public/uploads/');
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const originalname = file.originalname.split('.')[0];
          cb(null, `${originalname}-${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
    }),
  ],
  exports: [MulterModule],
})
export class MulterConfigModule {}
