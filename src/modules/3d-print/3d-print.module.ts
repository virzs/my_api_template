import { Module } from '@nestjs/common';
import { MaterialModule } from './material/material.module';
import { ModelModule } from './model/model.module';
import { BrandModule } from './brand/brand.module';
import { ConstantModule } from './constant/constant.module';

@Module({
  imports: [BrandModule, MaterialModule, ModelModule, ConstantModule],
})
export class TDPrintModule {}
