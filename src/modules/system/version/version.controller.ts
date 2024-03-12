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
import { VersionService } from './version.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/public/dto/page';
import { VersionDto } from './dto/version.dto';

@ApiTags('系统/版本管理')
@Controller('system/version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get('/')
  @ApiOperation({ summary: '版本分页' })
  @ApiQuery({ type: PageDto })
  page(@Query() query: PageDto) {
    return this.versionService.page(query);
  }

  @Post('/')
  @ApiOperation({ summary: '创建版本' })
  create(@Body() body: VersionDto) {
    return this.versionService.create(body);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新版本' })
  update(@Param('id') id: string, @Body() body: VersionDto) {
    return this.versionService.update(id, body);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除版本' })
  delete(@Param('id') id: string) {
    return this.versionService.delete(id);
  }

  @Get('/latest')
  @ApiOperation({ summary: '最新版本' })
  latest(@Query('platform') platform: string) {
    return this.versionService.latest(platform);
  }

  @Get('/:id')
  @ApiOperation({ summary: '版本详情' })
  detail(@Param('id') id: string) {
    return this.versionService.detail(id);
  }
}
