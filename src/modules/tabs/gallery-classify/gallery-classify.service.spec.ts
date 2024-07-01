import { Test, TestingModule } from '@nestjs/testing';
import { GalleryClassifyService } from './gallery-classify.service';

describe('GalleryClassifyService', () => {
  let service: GalleryClassifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GalleryClassifyService],
    }).compile();

    service = module.get<GalleryClassifyService>(GalleryClassifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
