import { Module } from '@nestjs/common';
import { ModelModule } from './model/model.module';
import { ConstantModule } from './constant/constant.module';
import { OrderModule } from './order/order.module';
import { SupplierModule } from './supplier/supplier.module';
import { FilamentModule } from './filament/filament.module';
import { FilamentTypeModule } from './filament-type/filament-type.module';
import { FilamentColorModule } from './filament-color/filament-color.module';
import { FilamentInfoModule } from './filament-info/filament-info.module';
import { ModelTypeModule } from './model-type/model-type.module';

@Module({
  imports: [
    SupplierModule,
    ModelModule,
    ConstantModule,
    OrderModule,
    FilamentModule,
    FilamentTypeModule,
    FilamentColorModule,
    FilamentInfoModule,
    ModelTypeModule,
  ],
})
export class TDPrintModule {}
