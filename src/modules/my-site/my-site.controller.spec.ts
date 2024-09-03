import { Test, TestingModule } from '@nestjs/testing';
import { MySiteController } from './my-site.controller';
import { MySiteService } from './my-site.service';

describe('MySiteController', () => {
  let controller: MySiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MySiteController],
      providers: [MySiteService],
    }).compile();

    controller = module.get<MySiteController>(MySiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
