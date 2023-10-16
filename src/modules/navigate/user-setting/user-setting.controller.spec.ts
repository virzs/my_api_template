import { Test, TestingModule } from '@nestjs/testing';
import { UserSettingController } from './user-setting.controller';
import { UserSettingService } from './user-setting.service';

describe('UserSettingController', () => {
  let controller: UserSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSettingController],
      providers: [UserSettingService],
    }).compile();

    controller = module.get<UserSettingController>(UserSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
