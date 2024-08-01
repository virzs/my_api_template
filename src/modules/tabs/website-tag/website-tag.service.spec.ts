import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteTagService } from './website-tag.service';

describe('WebsiteTagService', () => {
  let service: WebsiteTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsiteTagService],
    }).compile();

    service = module.get<WebsiteTagService>(WebsiteTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
