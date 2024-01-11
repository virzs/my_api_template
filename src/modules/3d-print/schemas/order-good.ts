import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';
import { The3dPrintFilament } from './filament';
import { The3dPrintFilamentName } from './ref-names';

@Schema({ timestamps: true })
export class The3dPrintOrderGood extends BaseSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: The3dPrintFilamentName,
  })
  filament: The3dPrintFilament;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number })
  price: number;
}

export const OrderGoodSchema =
  SchemaFactory.createForClass(The3dPrintOrderGood);

OrderGoodSchema.pre('find', baseSchemaPreFind);

OrderGoodSchema.methods.toJSON = baseSchemaToJSON;
