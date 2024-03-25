// multer.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

@Module({
  imports: [
    MulterModule.register({
      dest: './public/uploads/', 
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const folder = req.query.folder;
          const sub_folder = req.query.sub_folder;
          console.log(folder);
          console.log(!sub_folder);
          let path =  './public/uploads/';
          if  (folder) {
            path  += `${folder}/`;
            if  (sub_folder) {
              path  += `${sub_folder}/`;
            }
          }
          if (!existsSync(path)) {
            mkdirSync(path, { recursive: true });
          }
          cb(null, path);
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
