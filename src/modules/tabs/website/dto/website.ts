import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsOptional, IsString, IsUrl } from 'class-validator';
import { PageDto } from 'src/public/dto/page';

export class WebsitesForUserDto extends PageDto {
  @ApiProperty({ description: '分类' })
  @IsMongoId()
  @Expose()
  classify: string;

  @ApiProperty({ description: '标签' })
  @IsMongoId({ each: true })
  @IsOptional()
  @Expose()
  tags: string[];

  @ApiProperty({ description: '搜索' })
  @IsString()
  @IsOptional()
  @Expose()
  search: string;
}

export class WebsiteDto {
  @ApiProperty({ description: '名称' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: 'URL' })
  @IsUrl()
  @Expose()
  url: string;

  @ApiProperty({ description: '图标' })
  @IsString()
  @IsOptional()
  @Expose()
  icon: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  @IsOptional()
  @Expose()
  description: string;

  @ApiProperty({ description: '分类' })
  @IsMongoId()
  @IsOptional()
  @Expose()
  classify: string;

  @ApiProperty({ description: '标签' })
  @IsMongoId({ each: true })
  @IsOptional()
  @Expose()
  tags: string[];
}
