import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/skip-auth.decorator';
import { AuthTokensProvider } from '../providers/auth-tokens.provider';
import { SessionService } from 'src/session/session.service';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly authTokenProvider: AuthTokensProvider,
    private readonly sessionService: SessionService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    /**
     * researching for a simplified solution, mostly caching techniques
     */
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const accessToken = request?.signedCookies['refresh-cookie'];

    try {
      const payload =
        await this.authTokenProvider.verifyRefreshToken(accessToken);

      //
      const session = await this.sessionService.findById(payload?.sid);
      const sysDate = new Date();

      if (sysDate > session.expiresAt) {
        response.clearCookie('access-cookie');
        response.clearCookie('refresh-cookie');
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }

    return super.canActivate(context);
  }
}
