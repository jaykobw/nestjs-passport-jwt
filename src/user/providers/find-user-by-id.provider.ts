import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindUserByIdProvider {
  constructor(
    /**
     * Inject UserRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (!user)
      throw new BadRequestException('user id is invalid or does not exist');

    return user;
  }
}
