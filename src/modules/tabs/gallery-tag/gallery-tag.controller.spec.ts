import { Test, TestingModule } from '@nestjs/testing';
import { GalleryTagController } from './gallery-tag.controller';
import { GalleryTagService } from './gallery-tag.service';

describe('GalleryTagController', () => {
  let controller: GalleryTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryTagController],
      providers: [GalleryTagService],
    }).compile();

    controller = module.get<GalleryTagController>(GalleryTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
