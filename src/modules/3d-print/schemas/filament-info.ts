import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema from 'src/public/schema/base.schema';
import { The3dPrintFilamentColorName } from './ref-names';

@Schema({ timestamps: true })
export class The3dPrintFilamentInfo extends BaseSchema {
  @Prop({ type: Number, required: true })
  price: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: The3dPrintFilamentColorName,
    required: true,
  })
  color: string;
}

export const FilamentInfoSchema = SchemaFactory.createForClass(
  The3dPrintFilamentInfo,
);
