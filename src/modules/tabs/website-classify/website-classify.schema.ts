import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';

export const TabsWebsiteClassifyName = 'TabsWebsiteClassify';

@Schema({ timestamps: true })
export class TabsWebsiteClassify extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: TabsWebsiteClassifyName })
  parentId?: string;
}

export const TabsWebsiteClassifySchema =
  SchemaFactory.createForClass(TabsWebsiteClassify);

TabsWebsiteClassifySchema.pre('find', baseSchemaPreFind);

TabsWebsiteClassifySchema.methods.toJSON = baseSchemaToJSON;
