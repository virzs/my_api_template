import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';
import { PageDto } from 'src/public/dto/page';

export class SupplierPageDto extends PageDto {
  @ApiProperty({ description: '类型' })
  @IsNumberString(undefined, {
    message: '类型必须是数字',
  })
  @IsOptional()
  @Expose()
  type: number;
}
