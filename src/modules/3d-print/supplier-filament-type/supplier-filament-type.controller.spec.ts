import { Test, TestingModule } from '@nestjs/testing';
import { SupplierFilamentTypeController } from './supplier-filament-type.controller';
import { SupplierFilamentTypeService } from './supplier-filament-type.service';

describe('SupplierFilamentTypeController', () => {
  let controller: SupplierFilamentTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierFilamentTypeController],
      providers: [SupplierFilamentTypeService],
    }).compile();

    controller = module.get<SupplierFilamentTypeController>(SupplierFilamentTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
