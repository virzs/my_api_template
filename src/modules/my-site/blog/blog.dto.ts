import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';
import { Resource } from 'src/modules/resource/schemas/resource';
import { PageDto } from 'src/public/dto/page';

export class BlogDto {
  @ApiProperty({ description: '标题', type: String, required: true })
  @IsString()
  @Expose()
  title: string;

  @ApiProperty({ description: '内容', type: String, required: true })
  @IsString()
  @Expose()
  content: string;

  @ApiProperty({ description: '封面', type: Resource })
  @IsObject()
  @IsOptional()
  @Expose()
  cover: Resource;

  @ApiProperty({ description: '是否发布' })
  @IsBoolean()
  @IsOptional()
  @Expose()
  isPublish: boolean;
}

export class BlogPageDto extends PageDto {
  @ApiProperty({ description: '开始日期' })
  @IsString()
  @IsOptional()
  @Expose()
  startDate?: string;

  @ApiProperty({ description: '结束日期' })
  @IsString()
  @IsOptional()
  @Expose()
  endDate?: string;
}
