import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema from 'src/public/schema/base.schema';
import { The3dPrintFilamentName } from './ref-names';

@Schema({ timestamps: true })
export class The3dPrintFilamentColor extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  code: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, required: true })
  color: string;

  // 哪些耗材使用了这个颜色
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: The3dPrintFilamentName,
      },
    ],
  })
  filament: string[];
}

export const FilamentColorSchema = SchemaFactory.createForClass(
  The3dPrintFilamentColor,
);
