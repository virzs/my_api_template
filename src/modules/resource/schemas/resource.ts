import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';

@Schema({ timestamps: true })
export class Resource extends BaseSchema {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  key: string;

  @Prop({ type: String })
  mimetype: string;

  @Prop({ type: String })
  dir: string;

  @Prop({ type: Number })
  size: number;

  @Prop({ type: String })
  url: string;

  // 存储服务
  @Prop({ type: String })
  service: 'qiniu' | 'r2';
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);

ResourceSchema.pre('find', baseSchemaPreFind);

ResourceSchema.methods.toJSON = baseSchemaToJSON;
