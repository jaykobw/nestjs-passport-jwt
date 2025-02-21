import { Controller, Get } from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { UserService } from './user.service';
import { IActiveUser } from 'src/auth/interfaces/active-user.interface';

@Controller('user')
export class UserController {
  constructor(
    /**
     * Inject UserService
     */
    private readonly userService: UserService,
  ) {}

  @Get('/')
  public async getCurrentUser(@ActiveUser() currentUser: IActiveUser) {
    const user = await this.userService.findUserById(currentUser.id);
    return user;
  }
}
