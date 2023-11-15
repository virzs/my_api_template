import { Module } from '@nestjs/common';
import { FilamentService } from './filament.service';
import { FilamentController } from './filament.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FilamentSchema, The3dPrintFilament } from '../schemas/filament';
import { FilamentInfoModule } from '../filament-info/filament-info.module';
import { SupplierSchema, The3dPrintSupplier } from '../schemas/supplier';

@Module({
  controllers: [FilamentController],
  providers: [FilamentService],
  imports: [
    MongooseModule.forFeature([
      {
        name: The3dPrintFilament.name,
        schema: FilamentSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: The3dPrintSupplier.name,
        schema: SupplierSchema,
      },
    ]),
    FilamentInfoModule,
  ],
  exports: [FilamentService],
})
export class FilamentModule {}
