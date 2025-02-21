import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @MaxLength(40)
  name: string;

  @IsString()
  @MaxLength(40)
  ip: string;

  @IsString()
  @MaxLength(200)
  userAgent: string;

  @IsNotEmpty()
  @IsDate()
  expiresAt: Date;
}
