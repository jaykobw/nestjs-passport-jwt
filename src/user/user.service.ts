import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { FindUserByIdProvider } from './providers/find-user-by-id.provider';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    /**
     * Inject CreateUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,
    /**
     * Inject FindUserByEmailProvider
     */
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
    /**
     * Inject FindUserByIdProvider
     */
    private readonly findUserByIdProvider: FindUserByIdProvider,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.createUserProvider.create(createUserDto);
  }

  public async findUserByEmail(email: string): Promise<User> {
    return await this.findUserByEmailProvider.findUserByEmail(email);
  }

  public async findUserById(id: number): Promise<User> {
    return await this.findUserByIdProvider.findUserById(id);
  }
}
