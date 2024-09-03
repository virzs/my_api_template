import { Test, TestingModule } from '@nestjs/testing';
import { MySiteService } from './my-site.service';

describe('MySiteService', () => {
  let service: MySiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MySiteService],
    }).compile();

    service = module.get<MySiteService>(MySiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
