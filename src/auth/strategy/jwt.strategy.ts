import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.signedCookies['access-cookie'];
          return data;
        },
      ]),
      secretOrKey: configService.get<string>('jwt.jwtAccessTokenPublicKey'),
      algorithms: ['RS256'],
      ignoreExpiration: false,
    });
  }

  public async validate(payload: any) {
    console.log(payload);
    return payload;
  }
}
