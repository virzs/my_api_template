import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ description: '标题', required: true })
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString({ message: '标题必须是字符串' })
  title: string;

  @ApiProperty({ description: '内容', required: true })
  @IsNotEmpty({ message: '内容不能为空' })
  @IsString({ message: '内容必须是字符串' })
  content: string;

  @ApiProperty({ description: '反馈类型ID', required: true })
  @IsNotEmpty({ message: '反馈类型不能为空' })
  @IsMongoId({ message: '反馈类型ID格式不正确' })
  type: string;
}

export class UpdateFeedbackDto {
  @ApiProperty({ description: '标题', required: false })
  @IsOptional()
  @IsString({ message: '标题必须是字符串' })
  title?: string;

  @ApiProperty({ description: '内容', required: false })
  @IsOptional()
  @IsString({ message: '内容必须是字符串' })
  content?: string;

  @ApiProperty({ description: '反馈类型ID', required: false })
  @IsOptional()
  @IsMongoId({ message: '反馈类型ID格式不正确' })
  type?: string;

  @ApiProperty({ description: '处理人ID', required: false })
  @IsOptional()
  @IsMongoId({ message: '处理人ID格式不正确' })
  handler?: string;

  @ApiProperty({
    description: '状态',
    required: false,
    enum: ['pending', 'processing', 'replied', 'closed', 'reopened'],
  })
  @IsOptional()
  @IsEnum(['pending', 'processing', 'replied', 'closed', 'reopened'], {
    message: '状态值不正确',
  })
  status?: 'pending' | 'processing' | 'replied' | 'closed' | 'reopened';

  @ApiProperty({ description: '优先级', required: false })
  @IsOptional()
  priority?: number;
}

export class FeedbackQueryDto {
  @ApiProperty({ description: '状态', required: false })
  @IsOptional()
  @IsEnum(['pending', 'processing', 'replied', 'closed', 'reopened'], {
    message: '状态值不正确',
  })
  status?: string;

  @ApiProperty({ description: '反馈类型ID', required: false })
  @IsOptional()
  @IsMongoId({ message: '反馈类型ID格式不正确' })
  type?: string;

  @ApiProperty({ description: '提交人ID', required: false })
  @IsOptional()
  @IsMongoId({ message: '提交人ID格式不正确' })
  submitter?: string;

  @ApiProperty({ description: '处理人ID', required: false })
  @IsOptional()
  @IsMongoId({ message: '处理人ID格式不正确' })
  handler?: string;
}
