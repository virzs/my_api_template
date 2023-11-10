import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema from 'src/public/schema/base.schema';
import { The3dPrintFilament } from './filament';
import { The3dPrintFilamentType } from './filament-type';

@Schema({ timestamps: true })
export class The3dPrintSupplier extends BaseSchema {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String })
  nameEn: string;

  @Prop({ type: String })
  logo: string;

  @Prop({ type: String })
  description: string;

  //   品牌类型，0：3D打印机，1：3D打印耗材，2：3D打印服务，3：3D打印软件，4：3D扫描仪 Array 类型
  @Prop({ type: [{ type: Number }] })
  type: number[];

  @Prop({ type: String })
  url: string;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: The3dPrintFilament.name },
    ],
  })
  filament: The3dPrintFilament[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'The3dPrintFilamentType',
      },
    ],
  })
  filamentType: The3dPrintFilamentType[];
}

export const SupplierSchema = SchemaFactory.createForClass(The3dPrintSupplier);
