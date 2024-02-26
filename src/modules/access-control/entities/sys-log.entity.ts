import { SysUserEntity } from 'src/modules/sys-user/entities/sys-user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('idx_sys_log_request_at', ['requestAt'], {})
@Entity('sys_log', { schema: 'nestjs_starter' })
export class SysLogEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', default: () => "'0'" })
  userId: number;

  @Column('varchar', { name: 'ip', length: 31 })
  ip: string;

  @Column('varchar', { name: 'url', length: 255 })
  url: string;

  @Column('varchar', { name: 'params', length: 511, default: '' })
  params: string;

  @Column('datetime', {
    name: 'request_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  requestAt: Date;

  @ManyToOne(() => SysUserEntity, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: SysUserEntity;
}
