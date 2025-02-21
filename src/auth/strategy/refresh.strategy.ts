import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.signedCookies['refresh-cookie'];
          console.log(data);
          return data;
        },
      ]),
      secretOrKey: configService.get<string>('jwt.jwtRefreshTokenPublicKey'),
      ignoreExpiration: false,
      passReqToCallback: true,
      algorithms: ['RS256'],
    });
  }

  public async validate(req: Request, payload: any) {
    return payload;
  }
}
