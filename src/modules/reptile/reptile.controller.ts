import { Controller, Get } from '@nestjs/common';
import { ReptileService } from './reptile.service';
import { RequireLogin } from 'src/public/decorator/require_login.decorator';

@Controller('reptile')
export class ReptileController {
  constructor(private readonly reptileService: ReptileService) {}

  @Get('list')
  @RequireLogin()
  async fetchList() {
    return this.reptileService.fetchList();
  }

  @Get('detail')
  @RequireLogin()
  async fetchDetail() {
    return this.reptileService.fetchDetail();
  }
}
