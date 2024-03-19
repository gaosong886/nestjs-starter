import { Module } from '@nestjs/common';
import { SysUserService } from './service/sys-user.service';
import { SysUserController } from './controller/sys-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUserEntity } from './model/entity/sys-user.entity';
import { SysRoleEntity } from '../access-control/model/entity/sys-role.entity';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { ConfigService } from '@nestjs/config';
import path from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([SysUserEntity, SysRoleEntity]),

    // 文件上传模块
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        // 自定义上传路径和文件名
        storage: multer.diskStorage({
          destination: configService.get<string>('fileUploadDir'),
          filename: (_req, file, cb) => {
            const uniqueName =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueName + path.extname(file.originalname));
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SysUserService],
  exports: [SysUserService],
  controllers: [SysUserController],
})
export class SysUserModule {}
