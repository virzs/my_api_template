import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRecordDto {
  @ApiProperty({ description: '所属反馈ID', required: true })
  @IsNotEmpty({ message: '反馈ID不能为空' })
  @IsMongoId({ message: '反馈ID格式不正确' })
  feedback: string;

  @ApiProperty({ 
    description: '操作类型', 
    required: true,
    enum: ['create', 'update', 'reply', 'close', 'reopen']
  })
  @IsNotEmpty({ message: '操作类型不能为空' })
  @IsEnum(['create', 'update', 'reply', 'close', 'reopen'], { 
    message: '操作类型值不正确' 
  })
  action: 'create' | 'update' | 'reply' | 'close' | 'reopen';

  @ApiProperty({ description: '备注内容', required: false })
  @IsOptional()
  @IsString({ message: '备注内容必须是字符串' })
  content?: string;

  @ApiProperty({ description: '附加数据', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class RecordQueryDto {
  @ApiProperty({ description: '所属反馈ID', required: false })
  @IsOptional()
  @IsMongoId({ message: '反馈ID格式不正确' })
  feedback?: string;

  @ApiProperty({ 
    description: '操作类型', 
    required: false,
    enum: ['create', 'update', 'reply', 'close', 'reopen']
  })
  @IsOptional()
  @IsEnum(['create', 'update', 'reply', 'close', 'reopen'], { 
    message: '操作类型值不正确' 
  })
  action?: 'create' | 'update' | 'reply' | 'close' | 'reopen';

  @ApiProperty({ description: '操作人ID', required: false })
  @IsOptional()
  @IsMongoId({ message: '操作人ID格式不正确' })
  operator?: string;
}