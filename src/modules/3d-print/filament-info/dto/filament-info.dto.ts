import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsHexColor, IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class FilamentInfoDto {
  @ApiProperty({ description: '价格' })
  @IsNumber()
  @Expose()
  price: number;

  @ApiProperty({ description: '颜色' })
  @IsHexColor()
  @Expose()
  color: string;

  @ApiProperty({ description: 'id' })
  @IsMongoId()
  @IsOptional()
  @Expose()
  _id?: string;
}

export class FilamentInfoWithParentDto extends FilamentInfoDto {
  @ApiProperty({ description: '耗材id' })
  @IsMongoId()
  @Expose()
  filament: string;
}
