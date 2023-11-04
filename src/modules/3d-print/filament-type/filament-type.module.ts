import { Module } from '@nestjs/common';
import { FilamentTypeService } from './filament-type.service';
import { FilamentTypeController } from './filament-type.controller';

@Module({
  controllers: [FilamentTypeController],
  providers: [FilamentTypeService]
})
export class FilamentTypeModule {}
