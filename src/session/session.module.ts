import { forwardRef, Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { FindSessionByIdProvider } from './providers/find-session-by-id.provider';
import { CreateSessionProvider } from './providers/create-session.provider';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), forwardRef(() => UserModule)],
  controllers: [SessionController],
  providers: [SessionService, FindSessionByIdProvider, CreateSessionProvider],
  exports: [SessionService],
})
export class SessionModule {}
