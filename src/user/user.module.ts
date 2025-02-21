import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindUserByIdProvider } from './providers/find-user-by-id.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, FindUserByEmailProvider, CreateUserProvider, FindUserByIdProvider],
})
export class UserModule {}
