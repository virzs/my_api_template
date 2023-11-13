import { Controller } from '@nestjs/common';
import { FilamentInfoService } from './filament-info.service';

@Controller('filament-info')
export class FilamentInfoController {
  constructor(private readonly filamentInfoService: FilamentInfoService) {}
}
