import { Module } from '@nestjs/common';
import { MaterialModule } from './material/material.module';
import { ModelModule } from './model/model.module';
import { ConstantModule } from './constant/constant.module';
import { OrderModule } from './order/order.module';
import { SupplierModule } from './supplier/supplier.module';
import { FilamentModule } from './filament/filament.module';

@Module({
  imports: [
    SupplierModule,
    MaterialModule,
    ModelModule,
    ConstantModule,
    OrderModule,
    FilamentModule,
  ],
})
export class TDPrintModule {}
