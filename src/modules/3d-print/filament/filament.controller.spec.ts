import { Test, TestingModule } from '@nestjs/testing';
import { FilamentController } from './filament.controller';
import { FilamentService } from './filament.service';

describe('FilamentController', () => {
  let controller: FilamentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilamentController],
      providers: [FilamentService],
    }).compile();

    controller = module.get<FilamentController>(FilamentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
