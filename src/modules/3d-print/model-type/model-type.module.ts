import { Module } from '@nestjs/common';
import { ModelTypeService } from './model-type.service';
import { ModelTypeController } from './model-type.controller';

@Module({
  controllers: [ModelTypeController],
  providers: [ModelTypeService]
})
export class ModelTypeModule {}
