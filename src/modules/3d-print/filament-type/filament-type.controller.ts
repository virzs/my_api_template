import { Controller } from '@nestjs/common';
import { FilamentTypeService } from './filament-type.service';

@Controller('filament-type')
export class FilamentTypeController {
  constructor(private readonly filamentTypeService: FilamentTypeService) {}
}
