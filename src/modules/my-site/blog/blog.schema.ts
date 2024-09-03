import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Resource } from 'src/modules/resource/schemas/resource';
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
  cover: string;
}

export const MySiteBlogSchema = SchemaFactory.createForClass(MySiteBlog);

baseSchemaMiddleware(MySiteBlogSchema);
