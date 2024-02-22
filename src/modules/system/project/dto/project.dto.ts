import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ResourceDto } from 'src/public/dto/resource.dto';

class SubObjectDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  @Expose()
  title: string;

  @ApiProperty({ description: '副标题' })
  @IsString()
  @Expose()
  subTitle: string;

  @ApiProperty({ description: '背景图', type: ResourceDto })
  @ValidateNested()
  @IsOptional()
  @Expose()
  background: ResourceDto;
}

export class ProjectDto {
  @ApiProperty({ description: '项目名称' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: '项目描述' })
  @IsString()
  @IsOptional()
  @Expose()
  description: string;

  @ApiProperty({ description: '是否需要邀请码注册' })
  @IsBoolean()
  @IsOptional()
  @Expose()
  forceInvitationCode: boolean;

  @ApiProperty({ description: '登录页设置', type: SubObjectDto })
  @ValidateNested()
  @IsOptional()
  @Expose()
  login?: SubObjectDto;

  @ApiProperty({ description: '注册页设置', type: SubObjectDto })
  @ValidateNested()
  @IsOptional()
  @Expose()
  register?: SubObjectDto;
}
