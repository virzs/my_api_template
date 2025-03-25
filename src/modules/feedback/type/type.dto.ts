import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TypeDto {
  @ApiProperty({ description: '类型', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  type: string;

  @ApiProperty({ description: '描述', type: String })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({ description: '是否启用', type: Boolean })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  enable?: boolean;

  @ApiProperty({ description: '处理人', type: String })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  handler?: string;
}

export class CreateTypeDto {
  @ApiProperty({ description: '类型名称', required: true })
  @IsNotEmpty({ message: '类型名称不能为空' })
  @IsString({ message: '类型名称必须是字符串' })
  type: string;

  @ApiProperty({ description: '类型描述', required: false })
  @IsOptional()
  @IsString({ message: '类型描述必须是字符串' })
  description?: string;

  @ApiProperty({ description: '是否启用', required: false, default: true })
  @IsOptional()
  @IsBoolean({ message: '启用状态必须是布尔值' })
  enable?: boolean;

  @ApiProperty({ description: '处理人ID', required: false })
  @IsOptional()
  @IsMongoId({ message: '处理人ID格式不正确' })
  handler?: string;
}

export class UpdateTypeDto {
  @ApiProperty({ description: '类型名称', required: false })
  @IsOptional()
  @IsString({ message: '类型名称必须是字符串' })
  type?: string;

  @ApiProperty({ description: '类型描述', required: false })
  @IsOptional()
  @IsString({ message: '类型描述必须是字符串' })
  description?: string;

  @ApiProperty({ description: '是否启用', required: false })
  @IsOptional()
  @IsBoolean({ message: '启用状态必须是布尔值' })
  enable?: boolean;

  @ApiProperty({ description: '处理人ID', required: false })
  @IsOptional()
  @IsMongoId({ message: '处理人ID格式不正确' })
  handler?: string;
}

export class TypeQueryDto {
  @ApiProperty({ description: '是否启用', required: false })
  @IsOptional()
  @IsBoolean({ message: '启用状态必须是布尔值' })
  enable?: boolean;

  @ApiProperty({ description: '处理人ID', required: false })
  @IsOptional()
  @IsMongoId({ message: '处理人ID格式不正确' })
  handler?: string;
}
