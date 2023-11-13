import { Test, TestingModule } from '@nestjs/testing';
import { FilamentInfoController } from './filament-info.controller';
import { FilamentInfoService } from './filament-info.service';

describe('FilamentInfoController', () => {
  let controller: FilamentInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilamentInfoController],
      providers: [FilamentInfoService],
    }).compile();

    controller = module.get<FilamentInfoController>(FilamentInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
