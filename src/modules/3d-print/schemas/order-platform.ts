import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';

@Schema({ timestamps: true })
export class The3dPrintOrderPlatform extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  logo?: string;
}

export const The3dPrintOrderPlatformSchema = SchemaFactory.createForClass(
  The3dPrintOrderPlatform,
);

The3dPrintOrderPlatformSchema.pre('find', baseSchemaPreFind);

The3dPrintOrderPlatformSchema.methods.toJSON = baseSchemaToJSON;
