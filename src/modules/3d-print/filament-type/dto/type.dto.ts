import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FilamentTypeDto {
  @ApiProperty({ description: '耗材类型名称' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  @IsOptional()
  @Expose()
  description: string;
}
