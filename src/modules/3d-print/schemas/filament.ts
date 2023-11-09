import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema from 'src/public/schema/base.schema';
import { The3dPrintFilamentType } from './filament-type';
import { The3dPrintFilamentPrice } from './filament-price';

@Schema({ timestamps: true })
export class The3dPrintFilament extends BaseSchema {
  //   供应商
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: '3DPrintSupplier' })
  supplier: string;

  // 耗材颜色
  // TODO 耗材颜色用数据库里的颜色表

  //   标称重量
  @Prop({ type: Number, default: 1000 })
  nominalWeight: number;

  //   耗材种类
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: The3dPrintFilamentType.name,
    required: true,
  })
  type: The3dPrintFilamentType;

  // 耗材每个颜色对应的价格
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: The3dPrintFilamentPrice.name,
      },
    ],
    required: true,
  })
  price: The3dPrintFilamentPrice[];

  @Prop({ type: String })
  description: string;
}

export const FilamentSchema = SchemaFactory.createForClass(The3dPrintFilament);
