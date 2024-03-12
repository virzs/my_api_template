import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ResourceDto } from 'src/public/dto/resource.dto';

export class VersionDto {
  @ApiProperty({ description: '版本号' })
  @IsString()
  @IsNotEmpty({ message: '版本号不能为空' })
  @Expose()
  version: string;

  @ApiProperty({ description: '发布平台' })
  @IsString()
  @IsNotEmpty({ message: '发布平台不能为空' })
  @Expose()
  platform: string;

  @ApiProperty({ description: '更新方式' })
  @IsNumberString()
  @IsNotEmpty({ message: '更新方式不能为空' })
  @Expose()
  updateType: string;

  @ApiProperty({ description: '更新内容' })
  @IsString()
  @IsNotEmpty({ message: '更新内容不能为空' })
  @Expose()
  content: string;

  @ApiProperty({ description: '附件', type: ResourceDto })
  @ValidateNested()
  @IsNotEmpty({ message: '附件不能为空' })
  @Expose()
  source: ResourceDto;

  @ApiProperty({ description: '发布时间' })
  @IsDateString()
  @IsOptional()
  @Expose()
  releaseTime: string;
}
