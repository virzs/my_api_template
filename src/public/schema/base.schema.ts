import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UsersName } from 'src/modules/users/schemas/ref-names';

/**
 * 默认 Schema 添加 创建人 创建时间 更新人 更新时间
 */
@Schema({ timestamps: true })
class BaseSchema extends Document {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: UsersName,
  })
  creator: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: UsersName,
  })
  updater: string;

  @Prop({ type: Boolean, default: false })
  isDelete: boolean;

  createdAt: Date;

  updatedAt: Date;
}

// 默认查询中间件函数
// BaseSchema.pre('find', function () {});
export const baseSchemaPreFind = function () {
  this.where({ isDelete: { $in: [false, null] } });
};

// 默认 toJSON 中间件函数
// BaseSchema.methods.toJSON = function () {};
export const baseSchemaToJSON = function () {
  const { isDelete, __v, ...data } = this.toObject();
  return data;
};

export default BaseSchema;
