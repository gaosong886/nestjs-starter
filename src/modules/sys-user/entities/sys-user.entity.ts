import { Exclude } from 'class-transformer';
import { SysRoleEntity } from 'src/modules/access-control/entities/sys-role.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('idx_sys_user_username', ['username'], { unique: true })
@Entity('sys_user', { schema: 'nestjs_starter' })
export class SysUserEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'ID' })
  id: number;

  @Column('varchar', { name: 'photo', length: 255, default: '' })
  photo: string;

  @Column('varchar', { name: 'nickname', length: 15 })
  nickname: string;

  @Column('varchar', { name: 'username', unique: true, length: 15 })
  username: string;

  @Exclude()
  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @Exclude()
  @Column('tinyint', { name: 'account_status', default: () => "'0'" })
  accountStatus: number;

  @Exclude()
  @Column('varchar', { name: 'remark', length: 255, default: '' })
  remark: string;

  @Exclude()
  @Column('timestamp', {
    name: 'create_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Exclude()
  @Column('timestamp', {
    name: 'update_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @ManyToMany(() => SysRoleEntity, { cascade: true })
  @JoinTable({
    name: 'sys_user_role',
    joinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
  })
  roles: SysRoleEntity[];
}
