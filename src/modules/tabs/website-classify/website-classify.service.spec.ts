import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteClassifyService } from './website-classify.service';

describe('WebsiteClassifyService', () => {
  let service: WebsiteClassifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsiteClassifyService],
    }).compile();

    service = module.get<WebsiteClassifyService>(WebsiteClassifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
