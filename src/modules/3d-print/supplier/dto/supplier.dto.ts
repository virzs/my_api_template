import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ResourceDto } from 'src/public/dto/resource.dto';

export class SupplierDto {
  @ApiProperty({ description: '品牌名称' })
  @IsString({ message: '品牌名称必须是字符串' })
  @Expose()
  name: string;

  @ApiProperty({ description: '品牌英文名称' })
  @IsString({ message: '品牌英文名称必须是字符串' })
  @IsOptional()
  @Expose()
  nameEn: string;

  @ApiProperty({ description: '品牌logo', type: ResourceDto })
  @ValidateNested()
  @IsOptional()
  @Expose()
  logo: ResourceDto;

  @ApiProperty({ description: '品牌描述' })
  @IsString({ message: '品牌描述必须是字符串' })
  @IsOptional()
  @Expose()
  description: string;

  @ApiProperty({ description: '品牌类型' })
  @IsArray({ message: '品牌类型必须是数组' })
  @IsIn([0, 1, 2, 3, 4], {
    each: true,
    message: '品牌类型必须为指定的值',
  })
  @ArrayUnique()
  @IsOptional()
  @Expose()
  type: number[];

  @ApiProperty({ description: '网址' })
  @IsUrl({}, { message: '网址格式不正确' })
  @IsOptional()
  @Expose()
  url: string;

  @ApiProperty({ description: '耗材类型' })
  @IsArray()
  @IsOptional()
  @Expose()
  filamentType: string[];
}
