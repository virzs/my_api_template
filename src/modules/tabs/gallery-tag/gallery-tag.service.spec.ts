import { Test, TestingModule } from '@nestjs/testing';
import { GalleryTagService } from './gallery-tag.service';

describe('GalleryTagService', () => {
  let service: GalleryTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GalleryTagService],
    }).compile();

    service = module.get<GalleryTagService>(GalleryTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
