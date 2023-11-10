import { Module } from '@nestjs/common';
import { FilamentColorService } from './filament-color.service';
import { FilamentColorController } from './filament-color.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FilamentColorSchema,
  The3dPrintFilamentColor,
} from '../schemas/filament-color';

@Module({
  controllers: [FilamentColorController],
  providers: [FilamentColorService],
  imports: [
    MongooseModule.forFeature([
      {
        name: The3dPrintFilamentColor.name,
        schema: FilamentColorSchema,
      },
    ]),
  ],
  exports: [FilamentColorService],
})
export class FilamentColorModule {}
