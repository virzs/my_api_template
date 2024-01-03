import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';

@Schema({ timestamps: true })
export class The3dPrintModel extends BaseSchema {}

export const The3dPrintModelSchema =
  SchemaFactory.createForClass(The3dPrintModel);

The3dPrintModelSchema.pre('find', baseSchemaPreFind);

The3dPrintModelSchema.methods.toJSON = baseSchemaToJSON;
