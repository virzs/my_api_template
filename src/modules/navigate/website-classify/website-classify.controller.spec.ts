import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteClassifyController } from './website-classify.controller';
import { WebsiteClassifyService } from './website-classify.service';

describe('WebsiteClassifyController', () => {
  let controller: WebsiteClassifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsiteClassifyController],
      providers: [WebsiteClassifyService],
    }).compile();

    controller = module.get<WebsiteClassifyController>(WebsiteClassifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
