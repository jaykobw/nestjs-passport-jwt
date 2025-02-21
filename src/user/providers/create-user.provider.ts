import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject UserRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    /**
     * Inject FindUserByEmailProvider
     */
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const user = await this.findUserByEmailProvider.checkIfExists(
      createUserDto.email,
    );

    if (user) throw new BadRequestException('email already in use!');

    const newUser = await this.userRepository.create(createUserDto);

    return await this.userRepository.save(newUser);
  }
}
