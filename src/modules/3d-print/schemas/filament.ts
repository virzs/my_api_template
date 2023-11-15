import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema from 'src/public/schema/base.schema';
import { The3dPrintFilamentType } from './filament-type';
import { The3dPrintSupplierName } from './supplier';
import {
  The3dPrintFilamentInfoName,
  The3dPrintFilamentTypeName,
} from './ref-names';
import { The3dPrintFilamentInfo } from './filament-info';

@Schema({ timestamps: true })
export class The3dPrintFilament extends BaseSchema {
  //   供应商
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: The3dPrintSupplierName })
  supplier: string;

  // 耗材颜色
  // TODO 耗材颜色用数据库里的颜色表

  //   标称重量
  @Prop({ type: Number, default: 1000 })
  nominalWeight: number;

  //   耗材种类
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: The3dPrintFilamentTypeName,
    required: true,
  })
  type: The3dPrintFilamentType;

  // 耗材每个颜色对应的价格
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: The3dPrintFilamentInfoName,
      },
    ],
    required: true,
  })
  info: The3dPrintFilamentInfo[];

  @Prop({ type: String })
  description: string;
}

export const FilamentSchema = SchemaFactory.createForClass(The3dPrintFilament);
