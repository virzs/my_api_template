import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';
import { The3dPrintModelTypeName } from './ref-names';

@Schema({ timestamps: true })
export class The3dPrintModelType extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: The3dPrintModelTypeName })
  parent: The3dPrintModelType;
}

export const The3dPrintModelTypeSchema =
  SchemaFactory.createForClass(The3dPrintModelType);

The3dPrintModelTypeSchema.pre('find', baseSchemaPreFind);

The3dPrintModelTypeSchema.methods.toJSON = baseSchemaToJSON;
