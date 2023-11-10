import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema from 'src/public/schema/base.schema';

@Schema({ timestamps: true })
export class The3dPrintFilamentPrice extends BaseSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'The3dPrintFilament',
    required: true,
  })
  filament: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'The3dPrintFilamentColor',
    required: true,
  })
  color: string;
}

export const FilamentPriceSchema = SchemaFactory.createForClass(
  The3dPrintFilamentPrice,
);
