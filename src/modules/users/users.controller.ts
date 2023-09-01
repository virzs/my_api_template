import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/dtos/user';
import { UsersService } from './users.service';
import { PageDto } from 'src/dtos/page';

@ApiTags('用户')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('normal')
  @ApiOperation({ summary: '普通用户' })
  @ApiParam({ name: 'page', description: '页码', example: 1 })
  @ApiParam({ name: 'pageSize', description: '每页数量', example: 10 })
  getNormalUser(@Query() query: PageDto) {
    return this.usersService.getNormalUser(query);
  }
}
