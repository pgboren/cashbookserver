import { Module } from '@nestjs/common';
import { MulterConfigModule } from './multer.module';
import { UserService } from './services/user.service';

import { UniqueUsernameValidator } from './validator/UniqueUsernameValidator';
import { UniqueUserEmailValidator } from './validator/UniqueUserEmailValidator';
import { RoleService } from './services/role.service';

import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { MediaController } from './controllers/media.controller';
import { MediaUploadService } from './services/media/media.upload.service';
import { ColorService } from './services/color.service';
import { ColorController } from './controllers/color.controller';
import { ItemService } from './services/item.service';
import { ItemController } from './controllers/item.controller';

@Module({
  imports: [MulterConfigModule],
  controllers: [UserController, RoleController, MediaController, ColorController, ItemController],
  providers: [UserService, ItemService, RoleService, MediaUploadService, ColorService, UniqueUsernameValidator, UniqueUserEmailValidator],
  exports: [UniqueUsernameValidator, UniqueUserEmailValidator],
})
export class AppModule {}
