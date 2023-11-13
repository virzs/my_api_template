import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema from 'src/public/schema/base.schema';
import {
  The3dPrintFilamentColorName,
  The3dPrintFilamentName,
} from './ref-names';

@Schema({ timestamps: true })
export class The3dPrintFilamentPrice extends BaseSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: The3dPrintFilamentName,
    required: true,
  })
  filament: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: The3dPrintFilamentColorName,
    required: true,
  })
  color: string;
}

export const FilamentPriceSchema = SchemaFactory.createForClass(
  The3dPrintFilamentPrice,
);
