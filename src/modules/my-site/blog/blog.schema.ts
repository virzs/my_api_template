import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Resource } from 'src/modules/resource/schemas/resource';
import { UsersName } from 'src/modules/users/schemas/ref-names';
import BaseSchema, {
  baseSchemaMiddleware,
} from 'src/public/schema/base.schema';

export const MySiteBlogSchemaName = 'MySiteBlog';

@Schema({ timestamps: true })
export class MySiteBlog extends BaseSchema {
  @ApiProperty({ description: '标题', type: String, required: true })
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty({ description: '内容', type: String, required: true })
  @Prop({ type: String, required: true })
  content: string;

  @ApiProperty({ description: '封面', type: String })
  @Prop({ type: Resource })
  cover: Resource;

  @ApiProperty({ description: '是否发布', type: Boolean, default: false })
  @Prop({ type: Boolean, default: false })
  isPublish: boolean;

  @ApiProperty({ description: '发布时间', type: Date })
  @Prop({ type: Date })
  publishTime: Date;

  @ApiProperty({ description: '发布者', type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UsersName })
  publisher: string;
}

export const MySiteBlogSchema = SchemaFactory.createForClass(MySiteBlog);

baseSchemaMiddleware(MySiteBlogSchema);
