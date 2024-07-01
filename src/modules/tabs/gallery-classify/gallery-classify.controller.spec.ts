import { Test, TestingModule } from '@nestjs/testing';
import { GalleryClassifyController } from './gallery-classify.controller';
import { GalleryClassifyService } from './gallery-classify.service';

describe('GalleryClassifyController', () => {
  let controller: GalleryClassifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryClassifyController],
      providers: [GalleryClassifyService],
    }).compile();

    controller = module.get<GalleryClassifyController>(GalleryClassifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
