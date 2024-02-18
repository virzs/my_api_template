import { Test, TestingModule } from '@nestjs/testing';
import { BtbttController } from './btbtt.controller';
import { BtbttService } from './btbtt.service';

describe('BtbttController', () => {
  let controller: BtbttController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BtbttController],
      providers: [BtbttService],
    }).compile();

    controller = module.get<BtbttController>(BtbttController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
