import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { UsersName } from 'src/modules/users/schemas/ref-names';
import BaseSchema, {
  baseSchemaMiddleware,
} from 'src/public/schema/base.schema';

export const FeedbackTypeName = 'FeedbackType';

@Schema({ timestamps: true })
export class FeedbackType extends BaseSchema {
  @ApiProperty({ description: '类型', type: String, required: true })
  @Prop({ type: String, required: true })
  type: string;

  @ApiProperty({ description: '描述', type: String })
  @Prop({ type: String })
  description: string;

  @ApiProperty({ description: '是否启用', type: Boolean, default: true })
  @Prop({ type: Boolean, default: true })
  enable: boolean;

  @ApiProperty({ description: '处理人', type: mongoose.Schema.Types.ObjectId })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UsersName })
  handler: string;
}

export const FeedbackTypeSchema = SchemaFactory.createForClass(FeedbackType);

baseSchemaMiddleware(FeedbackTypeSchema);
