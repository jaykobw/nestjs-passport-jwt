import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { BcryptHashProvider } from './providers/bcrypt-hash.provider';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AuthTokensProvider } from './providers/auth-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject UserService
     */
    public readonly userService: UserService,
    /**
     * Inject Hashing Provider
     */
    private readonly bcryptHashProvider: BcryptHashProvider,
    /**
     * Inject JwtService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject configService
     */
    readonly configService: ConfigService,
    /**
     * Inject AuthTokensProvider
     */
    private readonly authTokensProvider: AuthTokensProvider,
  ) {}

  public async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    const isValidPassword = await this.bcryptHashProvider.comparePassword(
      password,
      user.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException('Invalid user credentials');

    return user;
  }

  public async register(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  public async login(user: User) {
    try {
      const { access_token, refresh_token } =
        await this.authTokensProvider.generateAuthTokens(user.id, user.email);

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
