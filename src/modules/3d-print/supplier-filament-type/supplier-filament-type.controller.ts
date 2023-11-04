import { Controller } from '@nestjs/common';
import { SupplierFilamentTypeService } from './supplier-filament-type.service';

@Controller('supplier-filament-type')
export class SupplierFilamentTypeController {
  constructor(private readonly supplierFilamentTypeService: SupplierFilamentTypeService) {}
}
