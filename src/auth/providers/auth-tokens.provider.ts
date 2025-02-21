import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthTokensProvider {
  constructor(
    /**
     * Inject JwtService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject ConfigService
     */
    readonly configService: ConfigService,
  ) {}

  public async generateAuthTokens(
    userId: number,
    email: string,
    sessionId: string,
  ) {
    const [access_token, refresh_token] = await Promise.all([
      // access token
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          algorithm: 'RS256',
          privateKey: this.configService.get<string>(
            'jwt.jwtAccessTokenPrivateKey',
          ),
          expiresIn: this.configService.get<string>('jwt.jwtAccessTokenTTL'),
          issuer: this.configService.get<string>('jwt.issuer'),
          audience: this.configService.get<string>('jwt.audience'),
        },
      ),
      // refresh token
      this.jwtService.signAsync(
        {
          sub: userId,
          sid: sessionId,
        },
        {
          algorithm: 'RS256',
          privateKey: this.configService.get<string>(
            'jwt.jwtRefreshTokenPrivateKey',
          ),
          expiresIn: this.configService.get<string>('jwt.jwtRefreshTokenTTL'),
          issuer: this.configService.get<string>('jwt.issuer'),
          audience: this.configService.get<string>('jwt.audience'),
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  public async verifyAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: this.configService.get<string>(
          'jwt.jwtAccessTokenPublicKey',
        ),
        algorithms: ['RS256'],
      });

      return payload;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async verifyRefreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: this.configService.get<string>(
          'jwt.jwtRefreshTokenPublicKey',
        ),
        algorithms: ['RS256'],
      });

      return payload;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
