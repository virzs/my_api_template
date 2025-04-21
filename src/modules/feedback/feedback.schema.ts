import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import BaseSchema, {
  baseSchemaMiddleware,
} from 'src/public/schema/base.schema';
import { FeedbackTypeName } from './type/type.schema';
import { UsersName } from 'src/modules/users/schemas/ref-names';

export const FeedbackSchemaName = 'Feedback';

@Schema({ timestamps: true })
export class Feedback extends BaseSchema {
  @ApiProperty({ description: '标题', type: String, required: true })
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty({ description: '内容', type: String, required: true })
  @Prop({ type: String, required: true })
  content: string;

  @ApiProperty({
    description: '反馈类型',
    type: mongoose.Schema.Types.ObjectId,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: FeedbackTypeName })
  type: string;

  @ApiProperty({ description: '提交人', type: mongoose.Schema.Types.ObjectId })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UsersName })
  submitter: string;

  @ApiProperty({ description: '处理人', type: mongoose.Schema.Types.ObjectId })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UsersName })
  handler: string;

  @ApiProperty({
    description: '状态',
    type: String,
    enum: ['pending', 'processing', 'replied', 'closed', 'reopened'],
    default: 'pending',
  })
  @Prop({ type: String, default: 'pending' })
  status: 'pending' | 'processing' | 'replied' | 'closed' | 'reopened';

  @ApiProperty({ description: '优先级', type: Number, default: 0 })
  @Prop({ type: Number, default: 0 })
  priority: number;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);

baseSchemaMiddleware(FeedbackSchema);
