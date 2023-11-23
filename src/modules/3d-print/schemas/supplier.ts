import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema from 'src/public/schema/base.schema';
import { The3dPrintFilament } from './filament';
import { The3dPrintFilamentType } from './filament-type';
import {
  The3dPrintFilamentName,
  The3dPrintFilamentTypeName,
} from './ref-names';
import { Resource } from 'src/schemas/resource';
import { ResourceName } from 'src/schemas/ref-names';

export const The3dPrintSupplierName = 'The3dPrintSupplier';

@Schema({ timestamps: true })
export class The3dPrintSupplier extends BaseSchema {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String })
  nameEn: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ResourceName })
  logo: Resource;

  @Prop({ type: String })
  description: string;

  //   品牌类型，0：3D打印机，1：3D打印耗材，2：3D打印服务，3：3D打印软件，4：3D扫描仪 Array 类型
  @Prop({ type: [{ type: Number }] })
  type: number[];

  @Prop({ type: String })
  url: string;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: The3dPrintFilamentName },
    ],
  })
  filament: The3dPrintFilament[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: The3dPrintFilamentTypeName,
      },
    ],
  })
  filamentType: The3dPrintFilamentType[];
}

export const SupplierSchema = SchemaFactory.createForClass(The3dPrintSupplier);
