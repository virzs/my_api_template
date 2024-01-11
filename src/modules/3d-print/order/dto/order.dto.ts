import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

class OrderGoodDto {
  @ApiProperty({ description: '耗材id' })
  @IsString()
  @Expose()
  filament: string;

  @ApiProperty({ description: '数量' })
  @IsNumber()
  @Min(0)
  @Expose()
  quantity: number;

  @ApiProperty({ description: '描述' })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({ description: '价格' })
  @IsNumber()
  @Min(0)
  @Expose()
  price: number;
}

export class OrderDto {
  @ApiProperty({ description: '订单号' })
  @IsString()
  @Expose()
  no: string;

  @ApiProperty({ description: '平台' })
  @IsString()
  @Expose()
  platform: string;

  @ApiProperty({ description: '耗材', type: [OrderGoodDto] })
  @Expose()
  goods: OrderGoodDto[];
}
