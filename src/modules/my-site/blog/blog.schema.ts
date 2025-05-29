import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Resource } from 'src/modules/resource/schemas/resource';
import { UsersName } from 'src/modules/users/schemas/ref-names';
import BaseSchema, {
  baseSchemaMiddleware,
} from 'src/public/schema/base.schema';

export const MySiteBlogSchemaName = 'MySiteBlog';

export const MySiteBlogOperationRecordSchemaName = 'MySiteBlogOperationRecord';

@Schema({ timestamps: true })
export class MySiteBlogOperationRecord extends BaseSchema {
  @ApiProperty({ description: '操作类型', type: String, required: true })
  @Prop({ type: String, required: true })
  type: 'edit' | 'publish' | 'unpublish';

  @ApiProperty({
    description: '操作人',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  operator: string;

  @ApiProperty({ description: '变更信息', type: Object })
  @Prop({ type: Object })
  change: object;

  @ApiProperty({
    description: '文章id',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MySiteBlogSchemaName })
  blogId: string;
}
@Schema({ timestamps: true })
export class MySiteBlog extends BaseSchema {
  @ApiProperty({ description: '标题', type: String, required: true })
  @Prop({ type: String, required: true })
  title: string;
  @ApiProperty({
    description: '内容',
    oneOf: [
      { type: 'string', description: 'Markdown 文本内容（旧格式）' },
      { type: 'object', description: '富文本编辑器内容（新格式）' },
    ],
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  content: string | object;

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

  @ApiProperty({ description: '操作记录', type: [MySiteBlogOperationRecord] })
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: MySiteBlogOperationRecordSchemaName,
      },
    ],
  })
  operationRecord: MySiteBlogOperationRecord[];
}

export const MySiteBlogSchema = SchemaFactory.createForClass(MySiteBlog);

export const MySiteBlogOperationRecordSchema = SchemaFactory.createForClass(
  MySiteBlogOperationRecord,
);

baseSchemaMiddleware(MySiteBlogSchema);

baseSchemaMiddleware(MySiteBlogOperationRecordSchema);
