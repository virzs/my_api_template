import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class FaqDto {
  @ApiProperty({ description: '问题', type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  question: string;

  @ApiProperty({ description: '答案', type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  answer: string;
}
