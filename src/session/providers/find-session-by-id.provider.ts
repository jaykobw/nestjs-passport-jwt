import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindSessionByIdProvider {
  constructor(
    /**
     * Inject SessionRepository
     */
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  public async findById(sessionId: string): Promise<Session> {
    const session = await this.sessionRepository.findOneBy({
      id: sessionId,
    });

    if (!session) throw new BadRequestException('invalid session id');

    return session;
  }
}
