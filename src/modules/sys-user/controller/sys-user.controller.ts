import { WinstonService } from '@gaosong886/nestjs-winston';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { SysUserService } from '../service/sys-user.service';
import { Request } from 'express';
import { AvoidPermission } from 'src/modules/access-control/decorator/avoid-permission.decorator';
import { PaginationVO } from 'src/common/model/vo/pagination.vo';
import { UpdateSysUserDTO } from '../model/dto/update-sys-user.dto';
import { CreateSysUserDTO } from '../model/dto/create-sys-user.dto';
import { FileUploadVO } from '../../../common/model/vo/file-upload.vo';
import { Upload, mimetypesfilter } from 'src/common/decorator/upload.decorator';
import { PaginationDTO } from 'src/common/model/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { SysUserVO } from '../model/vo/sys-user.vo';

@Controller('sys-user')
export class SysUserController {
  constructor(
    private logger: WinstonService,
    private sysUserService: SysUserService,
    private configService: ConfigService,
  ) {
    this.logger.setContext(SysUserController.name);
  }

  @AvoidPermission()
  @Get('profile')
  async profile(@Req() req: Request): Promise<SysUserVO> {
    return await this.sysUserService.getSysUserFromCache(req.user.id);
  }

  @Post('page')
  async page(
    @Body() paginationDTO: PaginationDTO,
  ): Promise<PaginationVO<SysUserVO>> {
    return await this.sysUserService.page(paginationDTO);
  }

  @Post('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSysUserDTO: UpdateSysUserDTO,
  ): Promise<void> {
    await this.sysUserService.update(id, updateSysUserDTO);
  }

  @Post('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.sysUserService.delete(id);
  }

  @Post('create')
  async create(@Body() createSysUserDTO: CreateSysUserDTO): Promise<SysUserVO> {
    return await this.sysUserService.create(createSysUserDTO);
  }

  @Post('photo')
  @Upload('file', {
    limits: { fileSize: 300 * 1024 },
    fileFilter: mimetypesfilter('image/png', 'image/jpeg'),
  })
  async photo(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileUploadVO> {
    return {
      name: file.filename,
      status: 'done',
      url: this.configService.get<string>('fileBaseUrl') + '/' + file.filename,
    };
  }
}
