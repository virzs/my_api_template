import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { FeedbackSchemaName } from '../feedback.schema';
import { UsersName } from 'src/modules/users/schemas/ref-names';
import BaseSchema, {
  baseSchemaMiddleware,
} from 'src/public/schema/base.schema';

export const FeedbackRecordName = 'FeedbackRecord';

@Schema({ timestamps: true })
export class FeedbackRecord extends BaseSchema {
  @ApiProperty({
    description: '所属反馈',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: FeedbackSchemaName,
    required: true,
  })
  feedback: string;

  @ApiProperty({ description: '操作人', type: mongoose.Schema.Types.ObjectId })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UsersName })
  operator: string;

  @ApiProperty({ description: '操作类型', type: String, required: true })
  @Prop({
    type: String,
    required: true,
    enum: ['create', 'update', 'reply', 'close', 'reopen'],
  })
  action: 'create' | 'update' | 'reply' | 'close' | 'reopen';

  @ApiProperty({ description: '备注内容', type: String })
  @Prop({ type: String })
  content: string;

  @ApiProperty({ description: '附加数据', type: Object })
  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const FeedbackRecordSchema =
  SchemaFactory.createForClass(FeedbackRecord);

baseSchemaMiddleware(FeedbackRecordSchema);
