import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SysUserEntity } from '../entities/sys-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, In, Like, Repository } from 'typeorm';
import { checkPassword, hashPassword } from 'src/common/utils/password.util';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ACCOUNT_STATUS } from '../constants/account-status.constant';
import { WinstonService } from '@gaosong886/nestjs-winston';
import { PaginationOutputDTO } from 'src/common/dtos/pagination-output.dto';
import { UpdateSysUserInputDTO } from '../dtos/update-sys-user-input.dto';
import { SysRoleEntity } from 'src/modules/access-control/entities/sys-role.entity';
import { InjectRedis, RedisClient } from '@gaosong886/nestjs-redis';
import { SYS_USER_KEY } from '../constants/redis-keys.constant';
import { CreateSysUserInputDTO } from '../dtos/create-sys-user-input.dto';
import { plainToInstance } from 'class-transformer';
import _ from 'lodash';
import { PaginationInputDTO } from 'src/common/dtos/pagination-input.dto';

@Injectable()
export class SysUserService {
  constructor(
    private i18n: I18nService,
    private winstonService: WinstonService,
    @InjectRepository(SysUserEntity)
    private sysUserRepository: Repository<SysUserEntity>,
    @InjectRedis()
    private redisClient: RedisClient,
    private dataSource: DataSource,
  ) {
    this.winstonService.setContext(SysUserService.name);
  }

  async create(
    createSysUserInputDTO: CreateSysUserInputDTO,
  ): Promise<SysUserEntity> {
    // First, check if the username already exists
    const sysUser = await this.sysUserRepository.findOne({
      where: { username: createSysUserInputDTO.username },
    });
    if (sysUser) {
      // If username exists, throw an exception
      throw new ConflictException(
        this.i18n.t('error.USERNAME_EXISTS', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const newUser = new SysUserEntity();
    newUser.username = createSysUserInputDTO.username;
    newUser.password = await hashPassword(createSysUserInputDTO.password); // Hash the password before storing
    newUser.nickname = createSysUserInputDTO.nickname;
    newUser.photo = createSysUserInputDTO.photo;
    newUser.remark = createSysUserInputDTO.remark;

    // Start a transaction
    await this.dataSource.transaction(async (manager) => {
      newUser.roles = await manager.find(SysRoleEntity, {
        where: { id: In(_.uniq(createSysUserInputDTO.roleIds)) },
      });
      await manager.save(newUser);
      await this.storeSysUserInCache(newUser);
    });

    return newUser;
  }

  async validate(username: string, password: string): Promise<SysUserEntity> {
    const sysUser = await this.sysUserRepository.findOne({
      relations: ['roles'],
      where: { username: username },
    });
    if (sysUser) {
      if (sysUser.accountStatus === ACCOUNT_STATUS.BANNED) {
        throw new ForbiddenException(
          this.i18n.t('error.ACCOUNT_BANND', {
            lang: I18nContext.current().lang,
          }),
        );
      }
      if (await checkPassword(password, sysUser.password)) return sysUser;
    }

    // If user doesn't exist or password is incorrect, throw an exception
    throw new UnauthorizedException(
      this.i18n.t('error.LOGIN_FAILED', {
        lang: I18nContext.current().lang,
      }),
    );
  }

  async findById(id: number): Promise<SysUserEntity> {
    return await this.sysUserRepository.findOne({
      relations: ['roles'],
      where: {
        id: id,
      },
    });
  }

  async page(
    inputData: PaginationInputDTO,
    findManyOptions?: FindManyOptions<SysUserEntity>,
  ): Promise<PaginationOutputDTO<SysUserEntity>> {
    let options = {};
    if (inputData.query) {
      options = {
        where: [
          { nickname: Like(`%${inputData.query}%`) },
          { username: Like(`%${inputData.query}%`) },
        ],
      };
    }
    return await this.sysUserRepository.paginate(
      inputData.page,
      inputData.pageSize,
      { ...options, ...findManyOptions, relations: ['roles'] },
    );
  }

  async update(
    id: number,
    updateSysUserInputDTO: UpdateSysUserInputDTO,
  ): Promise<void> {
    // Start a transaction
    await this.dataSource.transaction(async (manager) => {
      const entity = await manager.findOne(SysUserEntity, {
        where: { id: id },
      });
      entity.username = updateSysUserInputDTO.username;
      entity.accountStatus = updateSysUserInputDTO.accountStatus;
      entity.nickname = updateSysUserInputDTO.nickname;
      entity.photo = updateSysUserInputDTO.photo;
      entity.remark = updateSysUserInputDTO.remark;
      if (updateSysUserInputDTO.password)
        entity.password = await hashPassword(updateSysUserInputDTO.password);

      entity.roles = await manager.find(SysRoleEntity, {
        where: { id: In(_.uniq(updateSysUserInputDTO.roleIds)) },
      });
      await manager.save(entity);
      await this.storeSysUserInCache(entity);
    });
  }

  async delete(userId: number) {
    if (userId == 1)
      throw new ConflictException(
        this.i18n.t('error.DELETE_USER_FAILED', {
          lang: I18nContext.current().lang,
        }),
      );

    // Start a transaction
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SysUserEntity, { id: userId });
      await this.deleteSysUserInCache(userId);
    });
  }

  async deleteSysUserInCache(userId: number) {
    await this.redisClient.del(SYS_USER_KEY(userId));
  }
  async storeSysUserInCache(entity: Record<string, any>): Promise<void> {
    await this.redisClient.set(SYS_USER_KEY(entity.id), JSON.stringify(entity));
  }

  async retrieveSysUserFromCache(userId: number): Promise<SysUserEntity> {
    const str = await this.redisClient.get(SYS_USER_KEY(userId));
    if (str) return plainToInstance(SysUserEntity, JSON.parse(str));

    // If there is no user data in cache, create one.
    const user = await this.findById(userId);
    if (user) await this.storeSysUserInCache(user);
    return user;
  }
}
