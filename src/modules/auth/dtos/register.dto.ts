import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @ApiProperty({ description: '验证码' })
  @IsNumberString()
  @Expose()
  captcha: number;

  @ApiProperty({ description: '邀请码' })
  @IsString()
  @IsOptional()
  @Expose()
  invitationCode: string;
}
