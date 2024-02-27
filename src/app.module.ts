import { Module } from '@nestjs/common';
import { MulterConfigModule } from './multer.module';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { FileUploadService } from './services/file.upload.service';
import { UniqueUsernameValidator } from './validator/UniqueUsernameValidator';
import { UniqueUserEmailValidator } from './validator/UniqueUserEmailValidator';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';

@Module({
  imports: [MulterConfigModule],
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService,FileUploadService, UniqueUsernameValidator, UniqueUserEmailValidator],
  exports: [UniqueUsernameValidator, UniqueUserEmailValidator],
})
export class AppModule {}
