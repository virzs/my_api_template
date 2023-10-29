import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandSchema } from '../schemas/brand';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [
    MongooseModule.forFeature([
      {
        name: '3DPrintBrand',
        schema: BrandSchema,
        collection: '3d-print-brand',
      },
    ]),
  ],
})
export class BrandModule {}
