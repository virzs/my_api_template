import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from 'src/public/schema/base.schema';

@Schema({ timestamps: true })
export class Project extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  //  项目编码 唯一
  @Prop({ type: String, required: true, unique: true })
  code: string;

  //   是否启用
  @Prop({ type: Boolean, default: true })
  enable: boolean;

  // 是否强制需要邀请码注册
  @Prop({ type: Boolean, default: false })
  forceInvitationCode: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
