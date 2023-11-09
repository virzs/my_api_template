import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierSchema } from '../schemas/supplier';
import { FilamentModule } from '../filament/filament.module';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService],
  imports: [
    MongooseModule.forFeature([
      {
        name: '3DPrintSupplier',
        schema: SupplierSchema,
        collection: '3d-print-supplier',
      },
    ]),
    FilamentModule,
  ],
})
export class SupplierModule {}
