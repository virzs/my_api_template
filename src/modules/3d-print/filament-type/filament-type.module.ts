import { Module } from '@nestjs/common';
import { FilamentTypeService } from './filament-type.service';
import { FilamentTypeController } from './filament-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FilamentTypeSchema } from '../schemas/filament-type';

@Module({
  controllers: [FilamentTypeController],
  providers: [FilamentTypeService],
  imports: [
    MongooseModule.forFeature([
      {
        name: '3DPrintFilamentType',
        schema: FilamentTypeSchema,
        collection: '3d-print-filament-type',
      },
    ]),
  ],
})
export class FilamentTypeModule {}
