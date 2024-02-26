import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PageDto } from 'src/public/dto/page';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('用户')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @ApiOperation({ summary: '用户' })
  @ApiParam({ name: 'page', description: '页码', example: 1 })
  @ApiParam({ name: 'pageSize', description: '每页数量', example: 10 })
  getNormalUser(@Query() query: PageDto) {
    return this.usersService.getNormalUser(query);
  }

  @Post('/')
  @ApiOperation({ summary: '新增' })
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新' })
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Get('/:id')
  @ApiOperation({ summary: '详情' })
  detail(@Param('id') id: string) {
    return this.usersService.detail(id);
  }

  @Put('/enable/:id')
  @ApiOperation({ summary: '启用/禁用' })
  changeEnable(@Param('id') id: string) {
    return this.usersService.changeEnable(id);
  }
}
