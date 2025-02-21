import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 40,
    default: 'api',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  ip: string;

  @Column({
    type: 'varchar',
    length: 200,
    default: 'unknown',
  })
  userAgent: string;

  @Column({
    type: Date,
  })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.session)
  user: User;
}
