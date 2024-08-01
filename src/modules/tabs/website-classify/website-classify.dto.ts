import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class WebsiteClassifyDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: '分类描述' })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({ description: '上级分类' })
  @IsMongoId()
  @IsOptional()
  @Expose()
  parentId?: string;
}
