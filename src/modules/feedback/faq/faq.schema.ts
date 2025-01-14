import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import BaseSchema, {
  baseSchemaMiddleware,
} from 'src/public/schema/base.schema';

export const FeedbackFaqName = 'FeedbackFaq';

@Schema({ timestamps: true })
export class FeedbackFaq extends BaseSchema {
  @ApiProperty({ description: '问题', type: String, required: true })
  @Prop({ type: String, required: true })
  question: string;

  @ApiProperty({ description: '答案', type: String, required: true })
  @Prop({ type: String, required: true })
  answer: string;

  @ApiProperty({
    description: '是否公开',
    type: Boolean,
    required: true,
    default: false,
  })
  @Prop({ type: Boolean, required: true, default: false })
  isPublic: boolean;
}

export const FeedbackFaqSchema = SchemaFactory.createForClass(FeedbackFaq);

baseSchemaMiddleware(FeedbackFaqSchema);
