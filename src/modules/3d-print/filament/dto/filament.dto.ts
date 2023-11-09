import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FilamentDto {
  @ApiProperty({ description: '供应商' })
  @IsMongoId()
  @Expose()
  supplier: string;

  @ApiProperty({ description: '标称重量' })
  @IsNumber()
  @Min(0)
  @Expose()
  nominalWeight: number;

  @ApiProperty({ description: '标价' })
  @IsNumber()
  @Min(0)
  @Expose()
  price: number;

  @ApiProperty({ description: '耗材种类' })
  @IsMongoId()
  @Expose()
  type: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;
}

export class FilamentListDto {
  @ApiProperty({ description: '供应商' })
  @IsMongoId()
  @IsOptional()
  @Expose()
  supplier: string;
}
