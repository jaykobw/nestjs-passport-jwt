import { Controller, Get, Param, Delete } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionService.show(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.destory(id);
  }
}
