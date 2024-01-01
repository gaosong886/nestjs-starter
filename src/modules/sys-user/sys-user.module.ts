import { Module } from '@nestjs/common';
import { SysUserService } from './services/sys-user.service';
import { SysUserController } from './controllers/sys-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUserEntity } from './entities/sys-user.entity';
import { SysRoleEntity } from '../access-control/entities/sys-role.entity';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { ConfigService } from '@nestjs/config';
import path from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([SysUserEntity, SysRoleEntity]),
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
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
