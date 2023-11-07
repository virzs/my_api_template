import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FilamentTypeService } from './filament-type.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilamentTypeDto } from './dto/type.dto';
import { User } from 'src/public/decorator/route-user.decoratpr';

@ApiTags('3D打印/耗材类型')
@Controller('3dPrint/filament-type')
export class FilamentTypeController {
  constructor(private readonly filamentTypeService: FilamentTypeService) {}

  @Get('/')
  @ApiOperation({ summary: '耗材类型列表' })
  list() {
    return this.filamentTypeService.list();
  }

  @Post('/')
  @ApiOperation({ summary: '新增耗材类型' })
  @ApiBody({ type: FilamentTypeDto })
  create(@Body() body: FilamentTypeDto, @User('_id') user: string) {
    return this.filamentTypeService.create(body, user);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新耗材类型' })
  @ApiBody({ type: FilamentTypeDto })
  update(
    @Param('id') id: string,
    @Body() body: FilamentTypeDto,
    @User('_id') user: string,
  ) {
    return this.filamentTypeService.update(id, body, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除耗材类型' })
  delete(@Param('id') id: string) {
    return this.filamentTypeService.delete(id);
  }

  @Get('/:id')
  @ApiOperation({ summary: '耗材类型详情' })
  detail(@Param('id') id: string) {
    return this.filamentTypeService.detail(id);
  }
}
