import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from 'src/public/schema/base.schema';

@Schema({ timestamps: true })
export class The3dPrintFilamentInfo extends BaseSchema {
  @Prop({ type: Number, required: true })
  price: number;

  @Prop({
    type: String,
    required: true,
  })
  color: string;
}

export const FilamentInfoSchema = SchemaFactory.createForClass(
  The3dPrintFilamentInfo,
);

FilamentInfoSchema.pre('find', function () {
  this.where({ isDelete: false });
});
