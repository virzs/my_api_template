import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsNumber, IsString, Min } from 'class-validator';

export class FilamentDto {
  @ApiProperty({ description: '名称' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: '供应商' })
  @IsMongoId()
  @Expose()
  supplier: string;

  @ApiProperty({ description: '颜色' })
  @IsString()
  @Expose()
  color: string;

  @ApiProperty({ description: '实际重量' })
  @IsNumber()
  @Min(0)
  @Expose()
  actualWeight: number;

  @ApiProperty({ description: '标称重量' })
  @IsNumber()
  @Min(0)
  @Expose()
  nominalWeight: number;

  @ApiProperty({ description: '价格' })
  @IsNumber()
  @Min(0)
  @Expose()
  price: number;

  @ApiProperty({ description: '供应商耗材编号' })
  @IsString()
  @Optional()
  @Expose()
  serialNumber: string;

  @ApiProperty({ description: '耗材种类' })
  @IsMongoId()
  @Expose()
  type: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  @Optional()
  @Expose()
  description: string;

  @ApiProperty({ description: '状态' })
  @IsNumber()
  @Optional()
  @Expose()
  status: number;
}

export class FilamentListDto {
  @ApiProperty({ description: '供应商' })
  @IsMongoId()
  @Optional()
  @Expose()
  supplier: string;
}
