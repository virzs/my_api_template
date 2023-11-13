import { Test, TestingModule } from '@nestjs/testing';
import { FilamentInfoService } from './filament-info.service';

describe('FilamentInfoService', () => {
  let service: FilamentInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilamentInfoService],
    }).compile();

    service = module.get<FilamentInfoService>(FilamentInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
