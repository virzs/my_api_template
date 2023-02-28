import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

/**
 * 默认 Schema 添加 创建人 创建时间 更新人 更新时间
 */
@Schema({ timestamps: true })
class BaseSchema {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  creator: string;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  updater: string;
}

export default BaseSchema;
