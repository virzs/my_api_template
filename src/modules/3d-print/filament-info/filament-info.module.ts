import { Module } from '@nestjs/common';
import { FilamentInfoService } from './filament-info.service';
import { FilamentInfoController } from './filament-info.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FilamentInfoSchema,
  The3dPrintFilamentInfo,
} from '../schemas/filament-info';

@Module({
  controllers: [FilamentInfoController],
  providers: [FilamentInfoService],
  imports: [
    MongooseModule.forFeature([
      {
        name: The3dPrintFilamentInfo.name,
        schema: FilamentInfoSchema,
      },
    ]),
  ],
  exports: [FilamentInfoService],
})
export class FilamentInfoModule {}
