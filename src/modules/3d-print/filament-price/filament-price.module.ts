import { Module } from '@nestjs/common';
import { FilamentPriceService } from './filament-price.service';
import { FilamentPriceController } from './filament-price.controller';

@Module({
  controllers: [FilamentPriceController],
  providers: [FilamentPriceService]
})
export class FilamentPriceModule {}
