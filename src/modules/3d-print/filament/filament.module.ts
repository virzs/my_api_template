import { Module } from '@nestjs/common';
import { FilamentService } from './filament.service';
import { FilamentController } from './filament.controller';

@Module({
  controllers: [FilamentController],
  providers: [FilamentService]
})
export class FilamentModule {}
