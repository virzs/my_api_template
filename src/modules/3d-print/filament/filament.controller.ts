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
import { FilamentService } from './filament.service';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilamentPageDto } from './dto/page.dto';
import { FilamentDto } from './dto/filament.dto';
import { User } from 'src/public/decorator/route-user.decoratpr';

@ApiTags('3D打印/耗材')
@Controller('3dPrint/filament')
export class FilamentController {
  constructor(private readonly filamentService: FilamentService) {}

  @Get('/')
  @ApiOperation({ summary: '分页' })
  @ApiQuery({ type: FilamentPageDto })
  getPage(@Query() query: FilamentPageDto) {
    return this.filamentService.page(query);
  }

  @Post('/')
  @ApiOperation({ summary: '新增' })
  @ApiBody({ type: FilamentDto })
  create(@Body() body: FilamentDto, @User('_id') user: string) {
    return this.filamentService.create(body, user);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新' })
  @ApiBody({ type: FilamentDto })
  update(
    @Param('id') id,
    @Body() body: FilamentDto,
    @User('_id') user: string,
  ) {
    return this.filamentService.update(id, body, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除' })
  delete(@Param('id') id: string) {
    return this.filamentService.delete(id);
  }

  @Get('/:id')
  @ApiOperation({ summary: '详情' })
  detail(@Param('id') id: string) {
    return this.filamentService.detail(id);
  }
}
