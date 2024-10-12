import { Test, TestingModule } from '@nestjs/testing';
import { CloudflareR2Controller } from './cloudflare-r2.controller';
import { CloudflareR2Service } from './cloudflare-r2.service';

describe('CloudflareR2Controller', () => {
  let controller: CloudflareR2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudflareR2Controller],
      providers: [CloudflareR2Service],
    }).compile();

    controller = module.get<CloudflareR2Controller>(CloudflareR2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
