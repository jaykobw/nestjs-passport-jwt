import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { ValidateEmailDto } from './dto/validate-email.dto';

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
  ) {}

  public async create(createUserDto: CreateUserDto) {
    return await this.createUserProvider.create(createUserDto);
  }

  public async findUserByEmail(email: string) {
    return await this.findUserByEmailProvider.findUserByEmail(email);
  }
}
