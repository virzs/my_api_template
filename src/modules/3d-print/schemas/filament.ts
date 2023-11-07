import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema from 'src/public/schema/base.schema';

@Schema({ timestamps: true })
export class Filament extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  //   供应商
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: '3DPrintSupplier' })
  supplier: string;

  @Prop({ type: String, required: true })
  color: string;

  //   实际重量
  @Prop({ type: Number, required: true })
  actualWeight: number;

  //   标称重量
  @Prop({ type: Number, default: 1000 })
  nominalWeight: number;

  @Prop({ type: Number, required: true })
  price: number;

  //   供应商 耗材编号
  @Prop({ type: String })
  serialNumber: string;

  //   耗材种类
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: '3DPrintSupplierFilamentType',
    required: true,
  })
  type: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number, required: true, default: 0 })
  status: number;
}

export const FilamentSchema = SchemaFactory.createForClass(Filament);
