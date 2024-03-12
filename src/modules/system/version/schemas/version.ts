import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Resource } from 'src/modules/resource/schemas/resource';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';

export const VersionName = 'Version';

@Schema({ timestamps: true })
export class Version extends BaseSchema {
  @Prop({ type: String, required: true, unique: true })
  version: string;

  //   发布平台
  @Prop({ type: String, required: true })
  platform: string;

  //   更新方式 1: 强制更新 2: 可选更新
  @Prop({ type: Number, required: true })
  updateType: string;

  //   更新内容
  @Prop({ type: String, required: true })
  content: string;

  //   安装包
  @Prop({ type: Resource, required: true })
  source: Resource;

  //   定时发布时间
  @Prop({ type: Date })
  releaseTime: Date;
}

export const VersionSchema = SchemaFactory.createForClass(Version);

VersionSchema.pre('find', baseSchemaPreFind);

VersionSchema.methods.toJSON = baseSchemaToJSON;
