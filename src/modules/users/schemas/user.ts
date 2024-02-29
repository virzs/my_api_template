import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema, { baseSchemaPreFind } from 'src/public/schema/base.schema';
import { Role, RoleName } from '../../system/role/schemas/role';
import { Project } from '../../system/project/schemas/project';
import { Resource } from 'src/modules/resource/schemas/resource';

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

  @Prop({ type: Resource })
  avatar: Resource;

  // 账号状态 0:未验证邮箱 1:正常 2:禁用
  @Prop({ type: Number, default: 0 })
  status: number;

  //  角色
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: RoleName }] })
  roles: Role[];

  // 类型 0: 管理员 1: 普通用户
  @Prop({ type: Number, default: 1 })
  type: number;

  // 项目
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
  projects: Project[];

  // 是否启用
  @Prop({ type: Boolean, default: true })
  enable: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(User);

UsersSchema.pre('find', baseSchemaPreFind);

UsersSchema.methods.toJSON = function () {
  const { password, salt, isDelete, __v, ...data } = this.toObject();
  return data;
};
