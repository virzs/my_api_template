import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class InvitationCodeDto {
  @ApiProperty({ description: '最大使用次数' })
  @IsNumber()
  @Expose()
  maxUse: number;
}
