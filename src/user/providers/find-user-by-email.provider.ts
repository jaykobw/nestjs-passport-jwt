import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class FindUserByEmailProvider {
  constructor(
    /**
     * Inject UserRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (!user) throw new BadRequestException('email not found');

    return user;
  }

  public async checkIfExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({
      email,
    });

    return user ? true : false;
  }
}
