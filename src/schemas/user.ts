import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema from 'src/public/schema/base.schema';
import { Role } from './role';
import { Project } from './project';

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  salt: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String })
  avatar: string;

  // 账号状态 0:未验证邮箱 1:正常 2:禁用
  @Prop({ type: Number, default: 0 })
  status: number;

  //  角色
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  // 类型 0: 管理员 1: 普通用户
  @Prop({ type: Number, default: 1 })
  type: string;

  // 项目
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
  projects: Project[];
}

export const UsersSchema = SchemaFactory.createForClass(User);
