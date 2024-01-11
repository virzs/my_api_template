import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from 'src/public/schema/base.schema';

@Schema({ timestamps: true })
export class The3dPrintFilamentType extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;
}

export const FilamentTypeSchema = SchemaFactory.createForClass(
  The3dPrintFilamentType,
);

FilamentTypeSchema.pre('find', function () {
  this.where({
    isDelete: false,
  });
});

FilamentTypeSchema.methods.toJSON = function () {
  const { isDelete, __v, creator, updater, createdAt, updatedAt, ...data } =
    this.toObject();
  return data;
};
