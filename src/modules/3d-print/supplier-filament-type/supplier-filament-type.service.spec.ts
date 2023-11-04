import { Test, TestingModule } from '@nestjs/testing';
import { SupplierFilamentTypeService } from './supplier-filament-type.service';

describe('SupplierFilamentTypeService', () => {
  let service: SupplierFilamentTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierFilamentTypeService],
    }).compile();

    service = module.get<SupplierFilamentTypeService>(SupplierFilamentTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
