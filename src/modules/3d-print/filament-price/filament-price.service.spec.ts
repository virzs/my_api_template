import { Test, TestingModule } from '@nestjs/testing';
import { FilamentPriceService } from './filament-price.service';

describe('FilamentPriceService', () => {
  let service: FilamentPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilamentPriceService],
    }).compile();

    service = module.get<FilamentPriceService>(FilamentPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
