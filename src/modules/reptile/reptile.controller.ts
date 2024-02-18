import { Controller, Get } from '@nestjs/common';
import { ReptileService } from './reptile.service';
import { RequireLogin } from 'src/public/decorator/require_login.decorator';

@Controller('reptile')
export class ReptileController {
  constructor(private readonly reptileService: ReptileService) {}
}
