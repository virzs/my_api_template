import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';
import {
  The3dPrintOrderGoodName,
  The3dPrintOrderPlatformName,
} from './ref-names';
import { The3dPrintOrderPlatform } from './order-platform';
import { The3dPrintOrderGood } from './order-good';

@Schema({ timestamps: true })
export class The3dPrintOrder extends BaseSchema {
  @Prop({ type: String, required: true })
  no: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: The3dPrintOrderPlatformName,
  })
  platform: The3dPrintOrderPlatform;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: The3dPrintOrderGoodName,
  })
  goods: The3dPrintOrderGood[];
}

export const The3dPrintOrderSchema =
  SchemaFactory.createForClass(The3dPrintOrder);

The3dPrintOrderSchema.pre('find', baseSchemaPreFind);

The3dPrintOrderSchema.methods.toJSON = baseSchemaToJSON;
