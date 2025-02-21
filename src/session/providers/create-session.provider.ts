import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSessionDto } from '../dto/create-session.dto';
import { IActiveUser } from 'src/auth/interfaces/active-user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CreateSessionProvider {
  constructor(
    /**
     * Inject SessionRepository
     */
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    /**
     * Inject UserService
     */
    private readonly userService: UserService,
  ) {}

  public async createSession(
    createSessionDto: CreateSessionDto,
    currentUser: IActiveUser,
  ) {
    const user = await this.userService.findUserById(currentUser.id);

    const newSession = await this.sessionRepository.create({
      ...createSessionDto,
      user: user,
    });

    return await this.sessionRepository.save(newSession);
  }
}
