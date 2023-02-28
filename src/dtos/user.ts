import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @MaxLength(20, { message: '用户名长度不能大于20位' })
  @MinLength(2, { message: '用户名长度不能小于2位' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @Expose()
  username: string;

  @ApiProperty({ description: '密码' })
  @MaxLength(20, { message: '密码长度不能大于20位' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Expose()
  password: string;
}
