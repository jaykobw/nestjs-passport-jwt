import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BcryptHashProvider {
  abstract hashPassword(
    data: string | Buffer,
  ): Promise<{ salt: string; bcryptString: string }>;

  abstract comparePassword(
    data: string | Buffer,
    encryptedString: string,
  ): Promise<boolean>;
}
