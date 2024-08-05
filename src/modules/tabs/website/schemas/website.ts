import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';
import { WebsiteClassifyName, WebsiteTagName } from './ref-names';
import { WebsiteClassify } from './classify';
import mongoose from 'mongoose';
import { WebsiteTag } from './tag';

@Schema({ timestamps: true })
export class Website extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String })
  icon: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number, default: 0 })
  click: number;

  @Prop({ type: Boolean, default: true })
  enable: boolean;

  @Prop({ type: Boolean, default: false })
  public: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: WebsiteClassifyName })
  classify: WebsiteClassify;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: WebsiteTagName }],
  })
  tags: WebsiteTag[];
}

export const WebsiteSchema = SchemaFactory.createForClass(Website);

WebsiteSchema.pre('find', baseSchemaPreFind);

WebsiteSchema.methods.toJSON = baseSchemaToJSON;
