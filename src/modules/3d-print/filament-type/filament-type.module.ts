import { Module } from '@nestjs/common';
import { FilamentTypeService } from './filament-type.service';
import { FilamentTypeController } from './filament-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FilamentTypeSchema,
  The3dPrintFilamentType,
} from '../schemas/filament-type';

@Module({
  controllers: [FilamentTypeController],
  providers: [FilamentTypeService],
  imports: [
    MongooseModule.forFeature([
      {
        name: The3dPrintFilamentType.name,
        schema: FilamentTypeSchema,
      },
    ]),
  ],
})
export class FilamentTypeModule {}
