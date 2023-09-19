import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';
import { LoginDto } from 'src/dtos/user';

export class RegisterDto extends LoginDto {
  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({ description: '验证码' })
  @IsNumber()
  @Expose()
  captcha: number;
}
