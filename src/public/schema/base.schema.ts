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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isDelete, __v, ...data } = this.toObject();
  return data;
};

// 整合默认查询中间件函数和默认 toJSON 中间件函数 参数为 Schema
export const baseSchemaMiddleware = (
  schema: mongoose.Schema,
  options?: {
    preFind?: () => void;
    preFindOne?: () => void;
    preFindOneAndUpdate?: () => void;
    preUpdate?: () => void;
    preUpdateOne?: () => void;
    preUpdateMany?: () => void;
    toJSON?: () => any;
  },
) => {
  const {
    preFind,
    preFindOne,
    preFindOneAndUpdate,
    preUpdate,
    preUpdateOne,
    preUpdateMany,
    toJSON,
  } = options ?? {};

  schema.pre('find', preFind ?? baseSchemaPreFind);
  schema.pre('findOne', preFindOne ?? baseSchemaPreFind);
  schema.pre('findOneAndUpdate', preFindOneAndUpdate ?? baseSchemaPreFind);
  schema.pre('update', preUpdate ?? baseSchemaPreFind);
  schema.pre('updateOne', preUpdateOne ?? baseSchemaPreFind);
  schema.pre('updateMany', preUpdateMany ?? baseSchemaPreFind);
  schema.methods.toJSON = toJSON ?? baseSchemaToJSON;
};

export default BaseSchema;
