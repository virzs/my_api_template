import { Test, TestingModule } from '@nestjs/testing';
import { FilamentColorService } from './filament-color.service';

describe('FilamentColorService', () => {
  let service: FilamentColorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilamentColorService],
    }).compile();

    service = module.get<FilamentColorService>(FilamentColorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
