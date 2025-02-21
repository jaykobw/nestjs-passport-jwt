import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { SkipAuth } from './decorators/skip-auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    /**
     * AuthService
     */
    private readonly authService: AuthService,
  ) {}

  private setAuthCookies(
    res: Response,
    req: Request,
    token: { access_token: string; refresh_token: string },
  ) {
    // const accessExpiryDate = new Date(Date.now() + 24 + 3600 * 1000); // 1 day
    const refreshExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    res.cookie('access-cookie', token.access_token, {
      signed: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });

    res.cookie('refresh-cookie', token.refresh_token, {
      signed: true,
      sameSite: 'none',
      expires: refreshExpiryDate,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
  }

  @SkipAuth()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  public async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(req.user as User);
    this.setAuthCookies(res, req, tokens);

    return req.user;
  }

  @SkipAuth()
  @Post('/register')
  @HttpCode(HttpStatus.OK)
  public async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Res() res: Response) {
    res.clearCookie('access-cookie');
    res.clearCookie('refresh-cookie');
  }
}
