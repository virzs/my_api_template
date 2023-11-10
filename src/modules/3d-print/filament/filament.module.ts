import { Module } from '@nestjs/common';
import { FilamentService } from './filament.service';
import { FilamentController } from './filament.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FilamentSchema, The3dPrintFilament } from '../schemas/filament';

@Module({
  controllers: [FilamentController],
  providers: [FilamentService],
  imports: [
    MongooseModule.forFeature([
      {
        name: The3dPrintFilament.name,
        schema: FilamentSchema,
        collection: '3d-print-filament',
      },
    ]),
  ],
  exports: [FilamentService],
})
export class FilamentModule {}
