import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SysUserEntity } from '../model/entity/sys-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, In, Like, Repository } from 'typeorm';
import { checkPassword, hashPassword } from 'src/common/util/password.util';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ACCOUNT_STATUS } from '../constant/account-status.enum';
import { WinstonService } from '@gaosong886/nestjs-winston';
import { PaginationVO } from 'src/common/model/vo/pagination.vo';
import { UpdateSysUserDTO } from '../model/dto/update-sys-user.dto';
import { SysRoleEntity } from 'src/modules/access-control/model/entity/sys-role.entity';
import { InjectRedis, RedisClient } from '@gaosong886/nestjs-redis';
import { SYS_USER_KEY } from '../constant/redis-keys.constant';
import { CreateSysUserDTO } from '../model/dto/create-sys-user.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import _ from 'lodash';
import { PaginationDTO } from 'src/common/model/dto/pagination.dto';
import { SysUserVO } from '../model/vo/sys-user.vo';

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

  /**
   * 创建账号
   *
   */
  async create(createSysUserDTO: CreateSysUserDTO): Promise<SysUserVO> {
    const sysUser = await this.sysUserRepository.findOne({
      where: { username: createSysUserDTO.username },
    });
    if (sysUser) {
      // 账号已存在
      throw new ConflictException(
        this.i18n.t('error.USERNAME_EXISTS', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const newUser = new SysUserEntity();
    newUser.username = createSysUserDTO.username;

    // 密码在保存前先哈希
    newUser.password = await hashPassword(createSysUserDTO.password);

    newUser.nickname = createSysUserDTO.nickname;
    newUser.photo = createSysUserDTO.photo;
    newUser.remark = createSysUserDTO.remark;

    await this.dataSource.transaction(async (manager) => {
      newUser.roles = await manager.find(SysRoleEntity, {
        where: { id: In(_.uniq(createSysUserDTO.roleIds)) },
      });
      await manager.save(newUser);

      // 缓存用户信息
      await this.saveSysUserToCache(newUser);
    });

    return plainToInstance(SysUserVO, newUser);
  }

  /**
   * 验证账号密码
   *
   */
  async verify(username: string, password: string): Promise<SysUserVO> {
    const entity = await this.sysUserRepository.findOne({
      relations: ['roles'],
      where: { username: username },
    });

    if (entity) {
      if (entity.accountStatus === ACCOUNT_STATUS.BANNED) {
        // 账号已封禁
        throw new ForbiddenException(
          this.i18n.t('error.ACCOUNT_BANND', {
            lang: I18nContext.current().lang,
          }),
        );
      }
      if (await checkPassword(password, entity.password))
        return plainToInstance(SysUserVO, entity);
    }

    throw new UnauthorizedException(
      this.i18n.t('error.LOGIN_FAILED', {
        lang: I18nContext.current().lang,
      }),
    );
  }

  /**
   * 根据用户 id 查询
   *
   */
  async findById(id: number): Promise<SysUserVO> {
    const entity = await this.sysUserRepository.findOne({
      relations: ['roles'],
      where: {
        id: id,
      },
    });
    return plainToInstance(SysUserVO, entity);
  }

  /**
   * 分页查询
   *
   */
  async page(
    inputData: PaginationDTO,
    findManyOptions?: FindManyOptions<SysUserEntity>,
  ): Promise<PaginationVO<SysUserVO>> {
    let options = {};
    if (inputData.query) {
      options = {
        where: [
          { nickname: Like(`%${inputData.query}%`) },
          { username: Like(`%${inputData.query}%`) },
        ],
      };
    }
    const page = await this.sysUserRepository.paginate(
      inputData.page,
      inputData.pageSize,
      { ...options, ...findManyOptions, relations: ['roles'] },
    );

    // 这里 PaginationVO 使用了泛型
    // 需要先把 page 转换成 plainObject，否则 class-transformer 无法正常转换
    return plainToInstance(PaginationVO<SysUserVO>, instanceToPlain(page));
  }

  /**
   * 更新用户信息
   *
   */
  async update(id: number, updateSysUserDTO: UpdateSysUserDTO): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const entity = await manager.findOne(SysUserEntity, {
        where: { id: id },
      });
      entity.username = updateSysUserDTO.username;
      entity.accountStatus = updateSysUserDTO.accountStatus;
      entity.nickname = updateSysUserDTO.nickname;
      entity.photo = updateSysUserDTO.photo;
      entity.remark = updateSysUserDTO.remark;

      if (updateSysUserDTO.password)
        entity.password = await hashPassword(updateSysUserDTO.password);

      entity.roles = await manager.find(SysRoleEntity, {
        where: { id: In(_.uniq(updateSysUserDTO.roleIds)) },
      });
      await manager.save(entity);
      await this.saveSysUserToCache(entity);
    });
  }

  /**
   * 删除
   *
   */
  async delete(userId: number) {
    // Cant delete admin's account
    if (userId == 1)
      throw new ConflictException(
        this.i18n.t('error.DELETE_USER_FAILED', {
          lang: I18nContext.current().lang,
        }),
      );

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SysUserEntity, { id: userId });
      await this.deleteSysUserInCache(userId);
    });
  }

  /**
   * 从 Redis 缓存中删除
   *
   */
  private async deleteSysUserInCache(userId: number) {
    await this.redisClient.del(SYS_USER_KEY(userId));
  }

  /**
   * 保存用户信息到 Redis 缓存
   *
   */
  private async saveSysUserToCache(entity: Record<string, any>): Promise<void> {
    await this.redisClient.set(SYS_USER_KEY(entity.id), JSON.stringify(entity));
  }

  /**
   * 从 Redis 缓存中获取用户信息
   *
   */
  async getSysUserFromCache(userId: number): Promise<SysUserVO> {
    const str = await this.redisClient.get(SYS_USER_KEY(userId));
    if (str) {
      return plainToInstance(SysUserVO, JSON.parse(str));
    }

    // 缓存中没有的话，因为是后台接口，可以直接尝试从数据库中查询
    const user = await this.findById(userId);
    if (user) await this.saveSysUserToCache(user);
    return user;
  }
}
