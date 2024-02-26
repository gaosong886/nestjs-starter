import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SysPermissionEntity } from './sys-permission.entity';
import { Exclude } from 'class-transformer';
import { SysRoleEntity } from './sys-role.entity';

@Entity('sys_menu', { schema: 'nestjs_starter' })
export class SysMenuEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 15 })
  name: string;

  @Column('tinyint', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'icon', length: 255, default: '' })
  icon: string;

  @Column('int', { name: 'parent_id', default: () => "'0'" })
  parentId: number;

  @Column('varchar', { name: 'path', length: 255, default: '' })
  path: string;

  @Column('int', { name: 'sort_weight', default: () => "'0'" })
  sortWeight: number;

  @Column('tinyint', { name: 'hidden', default: () => "'0'" })
  hidden: number;

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

  @ManyToMany(() => SysPermissionEntity, { cascade: true })
  @JoinTable({
    name: 'sys_menu_permission',
    joinColumns: [{ name: 'menu_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'permission_id', referencedColumnName: 'id' }],
  })
  permissions: SysPermissionEntity[];

  @Exclude()
  @ManyToMany(() => SysRoleEntity, { cascade: true })
  @JoinTable({
    name: 'sys_role_menu',
    joinColumns: [{ name: 'menu_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
  })
  roles: SysRoleEntity[];
}
