import { Module } from '@nestjs/common';
import { FilamentColorService } from './filament-color.service';
import { FilamentColorController } from './filament-color.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FilamentColorSchema } from '../schemas/filament-color';

@Module({
  controllers: [FilamentColorController],
  providers: [FilamentColorService],
  imports: [
    MongooseModule.forFeature([
      {
        name: '3DPrintFilamentColor',
        schema: FilamentColorSchema,
        collection: '3d-print-filament-color',
      },
    ]),
  ],
  exports: [FilamentColorService],
})
export class FilamentColorModule {}
