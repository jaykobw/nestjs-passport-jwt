import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { BcryptHashProvider } from './providers/bcrypt-hash.provider';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AuthTokensProvider } from './providers/auth-tokens.provider';
import { SessionService } from 'src/session/session.service';
import { IActiveUser } from './interfaces/active-user.interface';
import { CreateSessionDto } from 'src/session/dto/create-session.dto';

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
     * Inject SessionService
     */
    private readonly sessionService: SessionService,
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

  public async login(user: User, metaData) {
    try {
      const sessionData = {
        name: 'api',
        ip: metaData?.ip,
        userAgent: metaData?.userAgent,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      } as CreateSessionDto;

      const currentUser = {
        id: user.id,
        email: user.email,
      } as IActiveUser;

      const newSession = await this.sessionService.create(
        sessionData,
        currentUser,
      );

      const { access_token, refresh_token } =
        await this.authTokensProvider.generateAuthTokens(
          user.id,
          user.email,
          newSession.id,
        );

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
