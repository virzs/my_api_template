import { Controller } from '@nestjs/common';
import { FilamentPriceService } from './filament-price.service';

@Controller('filament-price')
export class FilamentPriceController {
  constructor(private readonly filamentPriceService: FilamentPriceService) {}
}
