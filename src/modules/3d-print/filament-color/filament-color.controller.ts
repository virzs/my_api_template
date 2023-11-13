import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FilamentColorService } from './filament-color.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FilamentColorDto } from './dto/filament-color.dto';
import { User } from 'src/public/decorator/route-user.decoratpr';
import { The3dPrintModuleBaseUtil } from '../util';

@ApiTags('3D打印/耗材颜色库')
@Controller(`${The3dPrintModuleBaseUtil}/filament-color`)
export class FilamentColorController {
  constructor(private readonly filamentColorService: FilamentColorService) {}

  @Get('/')
  @ApiOperation({ summary: '列表' })
  async list() {
    return this.filamentColorService.list();
  }

  @Post('/')
  @ApiOperation({ summary: '新增' })
  @ApiBody({ type: FilamentColorDto })
  async create(@Body() body: FilamentColorDto, @User('_id') user: string) {
    return this.filamentColorService.create(body, user);
  }

  @Post('/:id')
  @ApiOperation({ summary: '更新' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: FilamentColorDto })
  async update(
    @Param('id') id: string,
    @Body() body: FilamentColorDto,
    @User('_id') user: string,
  ) {
    return this.filamentColorService.update(id, body, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id' })
  async delete(@Param('id') id: string) {
    return this.filamentColorService.delete(id);
  }
}
