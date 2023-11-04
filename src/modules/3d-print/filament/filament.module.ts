import { Module } from '@nestjs/common';
import { FilamentService } from './filament.service';
import { FilamentController } from './filament.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FilamentSchema } from '../schemas/filament';

@Module({
  controllers: [FilamentController],
  providers: [FilamentService],
  imports: [
    MongooseModule.forFeature([
      {
        name: '3DPrintFilament',
        schema: FilamentSchema,
        collection: '3d-print-supplier',
      },
    ]),
  ],
})
export class FilamentModule {}
