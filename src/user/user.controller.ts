import { Controller, Get } from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

@Controller('user')
export class UserController {
  constructor() {}

  @Get('/')
  public getCurrentUser(@ActiveUser() user) {
    return user;
  }
}
