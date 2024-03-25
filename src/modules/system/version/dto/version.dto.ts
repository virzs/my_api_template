import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Platform } from '../schemas/version';

export class VersionDto {
  @ApiProperty({ description: '版本号' })
  @IsString()
  @IsNotEmpty({ message: '版本号不能为空' })
  @Expose()
  version: string;

  @ApiProperty({ description: '发布平台' })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Platform)
  @Expose()
  platforms: Platform[];

  @ApiProperty({ description: '更新方式' })
  @IsIn([1, 2, '1', '2'], { message: '更新方式不正确' })
  @IsNotEmpty({ message: '更新方式不能为空' })
  @Expose()
  updateType: string;

  @ApiProperty({ description: '更新内容' })
  @IsString()
  @IsNotEmpty({ message: '更新内容不能为空' })
  @Expose()
  content: string;

  @ApiProperty({ description: '发布时间' })
  @IsDateString()
  @IsOptional()
  @Expose()
  releaseTime: string;
}
