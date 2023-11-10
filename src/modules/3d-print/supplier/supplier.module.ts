import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierSchema, The3dPrintSupplier } from '../schemas/supplier';
import { FilamentModule } from '../filament/filament.module';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService],
  imports: [
    MongooseModule.forFeature([
      {
        name: The3dPrintSupplier.name,
        schema: SupplierSchema,
      },
    ]),
    FilamentModule,
  ],
})
export class SupplierModule {}
