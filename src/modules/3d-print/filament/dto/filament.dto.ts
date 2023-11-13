import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class FilamentInfoDto {
  @ApiProperty({ description: '价格' })
  @IsNumber()
  @ValidateIf((o) => o._id === undefined)
  @Expose()
  price: number;

  @ApiProperty({ description: '颜色' })
  @IsMongoId()
  @ValidateIf((o) => o._id === undefined)
  @Expose()
  color: string;

  @ApiProperty({ description: 'id' })
  @IsMongoId()
  @ValidateIf((o) => o.price === undefined && o.color === undefined)
  @Expose()
  _id?: string;
}

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

  @ApiProperty({ description: '耗材种类' })
  @IsMongoId()
  @Expose()
  type: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({ description: '价格', type: [FilamentInfoDto] })
  @ValidateNested()
  @Expose()
  info: FilamentInfoDto[];
}

export class FilamentListDto {
  @ApiProperty({ description: '供应商' })
  @IsMongoId()
  @IsOptional()
  @Expose()
  supplier: string;
}
