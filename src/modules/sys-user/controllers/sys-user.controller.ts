import { WinstonService } from '@gaosong886/nestjs-winston';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  SerializeOptions,
  UploadedFile,
} from '@nestjs/common';
import { SysUserService } from '../services/sys-user.service';
import { Request } from 'express';
import { AvoidPermission } from 'src/modules/access-control/decorators/avoid-permission.decorator';
import { PaginationOutputDTO } from 'src/common/dtos/pagination-output.dto';
import { UpdateSysUserInputDTO } from '../dtos/update-sys-user-input.dto';
import { CreateSysUserInputDTO } from '../dtos/create-sys-user-input.dto';
import { SysUserEntity } from '../entities/sys-user.entity';
import { FileUploadOutputDTO } from '../../../common/dtos/file-upload-output.dto';
import {
  Upload,
  mimetypesfilter,
} from 'src/common/decorators/upload.decorator';
import { PaginationInputDTO } from 'src/common/dtos/pagination-input.dto';
import { ConfigService } from '@nestjs/config';

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
  async profile(@Req() req: Request): Promise<SysUserEntity> {
    return await this.sysUserService.retrieveSysUserFromCache(req.user.id);
  }

  @SerializeOptions({
    ignoreDecorators: true,
    excludePrefixes: ['password'],
  })
  @Post('page')
  async page(
    @Body() paginationInputDTO: PaginationInputDTO,
  ): Promise<PaginationOutputDTO<SysUserEntity>> {
    return await this.sysUserService.page(paginationInputDTO);
  }

  @Post('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() sysUserInputDTO: UpdateSysUserInputDTO,
  ): Promise<void> {
    await this.sysUserService.update(id, sysUserInputDTO);
  }

  @Post('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.sysUserService.delete(id);
  }

  @Post('create')
  async create(
    @Body() createSysUserInputDTO: CreateSysUserInputDTO,
  ): Promise<SysUserEntity> {
    return await this.sysUserService.create(createSysUserInputDTO);
  }

  @Post('photo')
  @Upload('file', {
    limits: { fileSize: 300 * 1024 },
    fileFilter: mimetypesfilter('image/png', 'image/jpeg'),
  })
  async photo(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileUploadOutputDTO> {
    return {
      name: file.filename,
      status: 'done',
      url: this.configService.get<string>('fileBaseUrl') + '/' + file.filename,
    };
  }
}
