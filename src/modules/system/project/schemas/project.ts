import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Resource } from 'src/modules/resource/schemas/resource';
import BaseSchema from 'src/public/schema/base.schema';

class SubObject {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  subTitle: string;

  @Prop({ type: Resource })
  background: Resource;
}

@Schema({ timestamps: true })
export class Project extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  //  项目编码 唯一
  @Prop({ type: String, unique: true })
  code: string;

  //   是否启用
  @Prop({ type: Boolean, default: true })
  enable: boolean;

  // 是否强制需要邀请码注册
  @Prop({ type: Boolean, default: false })
  forceInvitationCode: boolean;

  // 登录页设置
  @Prop({ type: SubObject })
  login: SubObject;

  // 注册页设置
  @Prop({ type: SubObject })
  register: SubObject;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
