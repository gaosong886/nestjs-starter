import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { SysMenuEntity } from './sys-menu.entity';

@Index('idx_sys_role_name', ['name'], { unique: true })
@Entity('sys_role', { schema: 'nestjs_starter' })
export class SysRoleEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 31 })
  name: string;

  @Exclude()
  @Column('varchar', { name: 'description', length: 255, default: '' })
  description: string;

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

  @ManyToMany(() => SysMenuEntity, { cascade: true })
  @JoinTable({
    name: 'sys_role_menu',
    joinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'menu_id', referencedColumnName: 'id' }],
  })
  menus: SysMenuEntity[];
}
