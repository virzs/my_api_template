import { Test, TestingModule } from '@nestjs/testing';
import { FilamentPriceController } from './filament-price.controller';
import { FilamentPriceService } from './filament-price.service';

describe('FilamentPriceController', () => {
  let controller: FilamentPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilamentPriceController],
      providers: [FilamentPriceService],
    }).compile();

    controller = module.get<FilamentPriceController>(FilamentPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
