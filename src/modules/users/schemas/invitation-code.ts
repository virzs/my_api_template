// 邀请码

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema, {
  baseSchemaPreFind,
  baseSchemaToJSON,
} from 'src/public/schema/base.schema';
import { UsersName } from './ref-names';

@Schema({ timestamps: true })
export class InvitationCode extends BaseSchema {
  @Prop({ type: String, required: true, unique: true })
  code: string;

  //   受邀请的用户
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: UsersName }] })
  users: string;

  //   最大使用次数
  @Prop({ type: Number, default: 1 })
  maxUse: number;

  //   状态 0: 已生效 1: 已失效 2:已禁用
  @Prop({ type: Number, default: 0 })
  status: number;

  //   使用次数
  @Prop({ type: Number, default: 0 })
  useCount: number;
}

export const InvitationCodeSchema =
  SchemaFactory.createForClass(InvitationCode);

InvitationCodeSchema.pre('find', baseSchemaPreFind);

InvitationCodeSchema.methods.toJSON = baseSchemaToJSON;