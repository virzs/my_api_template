import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ProjectDto {
  @ApiProperty({ description: '项目名称' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: '项目描述' })
  @IsString()
  @IsOptional()
  @Expose()
  description: string;
}
