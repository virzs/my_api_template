import { Module } from '@nestjs/common';
import { ConstantService } from './constant.service';
import { ConstantController } from './constant.controller';

@Module({
  controllers: [ConstantController],
  providers: [ConstantService]
})
export class ConstantModule {}
