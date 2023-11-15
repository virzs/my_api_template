import { Test, TestingModule } from '@nestjs/testing';
import { QiniuController } from './qiniu.controller';
import { QiniuService } from './qiniu.service';

describe('QiniuController', () => {
  let controller: QiniuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QiniuController],
      providers: [QiniuService],
    }).compile();

    controller = module.get<QiniuController>(QiniuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
