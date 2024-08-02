import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';
import { WebsiteName } from './ref-names';
import mongoose from 'mongoose';
import { Website } from './website';

@Schema({ timestamps: true })
export class WebsiteClassify extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  icon: string;

  @Prop({ type: Number, default: 0 })
  sort: number;

  @Prop({ type: Boolean, default: true })
  enable: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: WebsiteName }] })
  websites: Website[];
}

export const WebsiteClassifySchema =
  SchemaFactory.createForClass(WebsiteClassify);

WebsiteClassifySchema.pre('find', baseSchemaPreFind);

WebsiteClassifySchema.methods.toJSON = baseSchemaToJSON;
