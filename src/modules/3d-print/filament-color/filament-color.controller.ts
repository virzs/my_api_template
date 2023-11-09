import { Controller } from '@nestjs/common';
import { FilamentColorService } from './filament-color.service';

@Controller('filament-color')
export class FilamentColorController {
  constructor(private readonly filamentColorService: FilamentColorService) {}
}
