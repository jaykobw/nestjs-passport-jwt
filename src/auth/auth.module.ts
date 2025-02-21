import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { BcryptHashProvider } from './providers/bcrypt-hash.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthTokensProvider } from './providers/auth-tokens.provider';
import jwtConfig from 'src/config/jwt.config';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.get<string>('jwt.jwtAccessTokenPrivateKey'),
        publicKey: configService.get<string>('jwt.jwtAccessTokenPublicKey'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.jwtAccessTokenTTL'),
          algorithm: 'RS256',
        },
      }),
    }),
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: BcryptHashProvider,
      useClass: BcryptProvider,
    },
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    JwtAuthGuard,
    AuthTokensProvider,
  ],
  exports: [AuthModule, AuthTokensProvider],
})
export class AuthModule {}
