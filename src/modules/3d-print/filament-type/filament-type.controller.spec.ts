import { Test, TestingModule } from '@nestjs/testing';
import { FilamentTypeController } from './filament-type.controller';
import { FilamentTypeService } from './filament-type.service';

describe('FilamentTypeController', () => {
  let controller: FilamentTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilamentTypeController],
      providers: [FilamentTypeService],
    }).compile();

    controller = module.get<FilamentTypeController>(FilamentTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
