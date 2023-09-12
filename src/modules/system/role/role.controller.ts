import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/dtos/page';
import { CreateRoleDto } from './dto/create-role.dto';

@ApiTags('角色')
@Controller('system/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/')
  @ApiOperation({ summary: '角色列表' })
  @ApiQuery({ type: PageDto })
  list(@Query() query: PageDto) {
    return this.roleService.list(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: '角色详情' })
  detail(@Param('id') id: string) {
    return this.roleService.detail(id);
  }

  @Post('/')
  @ApiOperation({ summary: '创建角色' })
  @ApiBody({ type: CreateRoleDto })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新角色' })
  @ApiBody({ type: CreateRoleDto })
  update(@Param('id') id: string, @Body() body: CreateRoleDto) {
    return this.roleService.update(id, body);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除角色' })
  remove(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
