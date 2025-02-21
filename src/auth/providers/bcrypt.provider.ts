import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BcryptHashProvider } from './bcrypt-hash.provider';

@Injectable()
export class BcryptProvider implements BcryptHashProvider {
  private saltRounds = 13;

  async hashPassword(data: string | Buffer): Promise<{ salt; bcryptString }> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const bcryptString = await bcrypt.hash(data, salt);

    return { salt, bcryptString };
  }

  async comparePassword(
    data: string | Buffer,
    encryptedString: string,
  ): Promise<boolean> {
    return await bcrypt.compare(data, encryptedString);
  }
}
