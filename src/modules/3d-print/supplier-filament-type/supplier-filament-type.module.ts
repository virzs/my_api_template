import { Module } from '@nestjs/common';
import { SupplierFilamentTypeService } from './supplier-filament-type.service';
import { SupplierFilamentTypeController } from './supplier-filament-type.controller';

@Module({
  controllers: [SupplierFilamentTypeController],
  providers: [SupplierFilamentTypeService]
})
export class SupplierFilamentTypeModule {}
