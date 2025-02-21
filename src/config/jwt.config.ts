import { registerAs } from '@nestjs/config';
import * as fs from 'fs';

export default registerAs('jwt', () => {
  return {
    jwtAccessTokenName: process.env.JWT_ACCESS_TOKEN_NAME,
    jwtAccessTokenPublicKey: `${fs.readFileSync(process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY, 'utf-8')}`,
    jwtAccessTokenPrivateKey: `${fs.readFileSync(process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY, 'utf-8')}`,
    jwtAccessTokenTTL: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    // refresh token
    jwtRefreshTokenName: process.env.JWT_REFRESH_TOKEN_NAME,
    jwtRefreshTokenPublicKey: `${fs.readFileSync(process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY, 'utf-8')}`,
    jwtRefreshTokenPrivateKey: `${fs.readFileSync(process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY, 'utf-8')}`,
    jwtRefreshTokenTTL: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    //
    issuer: process.env.JWT_TOKEN_ISSUER,
    audience: process.env.JWT_TOKEN_AUDIENCE,
  };
});
