import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  appName: process.env.APP_NAME,
  nodeEnv: process.env.NODE_ENV,
  cookieSignature: process.env.COOKIE_SIGNATURE,
}));
