import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Session } from 'src/session/entities/session.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
    nullable: false,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  passwordSalt: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Session, (session) => session.user)
  session: Session[];

  @BeforeInsert()
  async encryptPassword() {
    const rounds = 13;
    const salt = await bcrypt.genSalt(rounds);

    this.passwordSalt = salt;
    this.password = await bcrypt.hash(this.password, salt);
  }
}
