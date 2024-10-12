import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UploadDto {
  @ApiProperty({ description: '文件名' })
  @IsString()
  @Expose()
  filename: string;

  @ApiProperty({ description: '文件' })
  @Expose()
  file: any;
}

export class GetVisitUrlsDto {
  @ApiProperty({ description: '文件id' })
  @IsString({ each: true })
  @Expose()
  ids: string[];
}
