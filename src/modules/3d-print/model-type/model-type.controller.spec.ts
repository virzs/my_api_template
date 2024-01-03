import { Test, TestingModule } from '@nestjs/testing';
import { ModelTypeController } from './model-type.controller';
import { ModelTypeService } from './model-type.service';

describe('ModelTypeController', () => {
  let controller: ModelTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelTypeController],
      providers: [ModelTypeService],
    }).compile();

    controller = module.get<ModelTypeController>(ModelTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
