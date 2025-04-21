import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import BaseSchema, {
  baseSchemaMiddleware,
} from 'src/public/schema/base.schema';

export interface MessageData {
  module: string;     // 消息所属模块
  title: string;      // 消息标题
  content: string;    // 消息内容
  extra?: any;        // 附加数据
}

export const MessageSchemaName = 'Message';

@Schema({ timestamps: true })
export class Message extends BaseSchema {
  @Prop({ type: String, required: true })
  type: string;

  @Prop({
    type: {
      module: { type: String, required: true },
      title: { type: String, required: true },
      content: { type: String, required: true },
      extra: { type: mongoose.Schema.Types.Mixed },
    },
    required: true,
  })
  data: MessageData;

  @Prop({ type: String })
  userId: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: Boolean, default: false })
  isBroadcast: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

baseSchemaMiddleware(MessageSchema);
