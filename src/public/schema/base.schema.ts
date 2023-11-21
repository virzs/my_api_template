import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

/**
 * 默认 Schema 添加 创建人 创建时间 更新人 更新时间
 */
@Schema({ timestamps: true })
class BaseSchema {
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  creator: string;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  updater: string;

  @Prop({ type: Boolean, default: false })
  isDelete: boolean;
}

// 默认查询中间件函数
// BaseSchema.pre('find', function () {});
export const baseSchemaPreFind = function () {
  this.where({ isDelete: false });
};

// 默认 toJSON 中间件函数
// BaseSchema.methods.toJSON = function () {};
export const baseSchemaToJSON = function () {
  const { isDelete, __v, ...data } = this.toObject();
  return data;
};

export default BaseSchema;
