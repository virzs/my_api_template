import { Test, TestingModule } from '@nestjs/testing';
import { ConstantController } from './constant.controller';
import { ConstantService } from './constant.service';

describe('ConstantController', () => {
  let controller: ConstantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConstantController],
      providers: [ConstantService],
    }).compile();

    controller = module.get<ConstantController>(ConstantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
