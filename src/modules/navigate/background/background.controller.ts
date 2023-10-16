import { Controller } from '@nestjs/common';
import { BackgroundService } from './background.service';

@Controller('background')
export class BackgroundController {
  constructor(private readonly backgroundService: BackgroundService) {}
}
