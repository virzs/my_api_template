import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';

@Schema({ timestamps: true })
export class Resource extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: String, required: true })
  mimetype: string;

  @Prop({ type: String, required: true })
  dir: string;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);

ResourceSchema.pre('find', baseSchemaPreFind);

ResourceSchema.methods.toJSON = baseSchemaToJSON;
