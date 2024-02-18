import { Test, TestingModule } from '@nestjs/testing';
import { BtbttService } from './btbtt.service';

describe('BtbttService', () => {
  let service: BtbttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BtbttService],
    }).compile();

    service = module.get<BtbttService>(BtbttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
