import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteTagController } from './website-tag.controller';
import { WebsiteTagService } from './website-tag.service';

describe('WebsiteTagController', () => {
  let controller: WebsiteTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsiteTagController],
      providers: [WebsiteTagService],
    }).compile();

    controller = module.get<WebsiteTagController>(WebsiteTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
