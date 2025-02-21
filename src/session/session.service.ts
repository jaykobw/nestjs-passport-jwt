import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { FindSessionByIdProvider } from './providers/find-session-by-id.provider';
import { CreateSessionProvider } from './providers/create-session.provider';
import { IActiveUser } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class SessionService {
  constructor(
    /**
     * Inject SessionRepository
     */
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    /**
     * Inject FindSessionByIdProvider
     */
    private readonly findSessionByIdProvider: FindSessionByIdProvider,
    /**
     * Inject CreateSessionProvider
     */
    private readonly createSessionProvider: CreateSessionProvider,
  ) {}

  public async create(
    createSessionDto: CreateSessionDto,
    currentUser: IActiveUser,
  ): Promise<Session> {
    return await this.createSessionProvider.createSession(
      createSessionDto,
      currentUser,
    );
  }

  public async findById(sessionId: string): Promise<Session> {
    const session = await this.findSessionByIdProvider.findById(sessionId);

    return session;
  }

  public async destory(sessionId: string) {
    const session = await this.findSessionByIdProvider.findById(sessionId);

    return await this.sessionRepository.delete(session.id);
  }
}
