import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from 'src/public/schema/base.schema';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Permission extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  url: string;

  @Prop({ type: String })
  method: string;

  //   权限类型 0:菜单 1:按钮
  @Prop({ type: Number })
  type: number;

  //   权限等级 0: 模块 1: 功能 2: 操作
  @Prop({ type: Number, default: 0 })
  level: number;

  //   上级权限，关联当前 schema
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' })
  parent: Permission;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
