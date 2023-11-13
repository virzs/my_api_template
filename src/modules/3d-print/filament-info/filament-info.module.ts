import { Module } from '@nestjs/common';
import { FilamentInfoService } from './filament-info.service';
import { FilamentInfoController } from './filament-info.controller';

@Module({
  controllers: [FilamentInfoController],
  providers: [FilamentInfoService]
})
export class FilamentInfoModule {}
