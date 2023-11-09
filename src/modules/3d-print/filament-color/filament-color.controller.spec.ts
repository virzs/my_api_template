import { Test, TestingModule } from '@nestjs/testing';
import { FilamentColorController } from './filament-color.controller';
import { FilamentColorService } from './filament-color.service';

describe('FilamentColorController', () => {
  let controller: FilamentColorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilamentColorController],
      providers: [FilamentColorService],
    }).compile();

    controller = module.get<FilamentColorController>(FilamentColorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
