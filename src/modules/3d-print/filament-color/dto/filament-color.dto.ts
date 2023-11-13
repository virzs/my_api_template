import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FilamentColorDto {
  @ApiProperty({ description: '名称' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: '颜色' })
  @IsString()
  @Expose()
  color: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({ description: '代码' })
  @IsString()
  @IsOptional()
  @Expose()
  code?: string;
}
