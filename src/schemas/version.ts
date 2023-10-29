import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from 'src/public/schema/base.schema';

@Schema({ timestamps: true })
export class Version extends BaseSchema {
  // 是否强制更新
  @Prop({ type: Boolean, default: false })
  forceUpdate: boolean;

  //   平台 0: ios 1: android 2: web_mobile 3: web_pc 4: mac 5: linux 6: windows 7: other 8: all
  @Prop({ type: Number, required: true })
  platform: number;

  //  版本号
  @Prop({ type: String, required: true })
  version: string;

  //   更新内容
  @Prop({ type: String, required: true })
  content: string;

  //   下载地址
  @Prop({ type: String })
  url: string;

  //   是否启用
  @Prop({ type: Boolean, default: true })
  enable: boolean;
}

export const VersionSchema = SchemaFactory.createForClass(Version);
