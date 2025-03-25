import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TypeService } from './type.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTypeDto, TypeQueryDto, UpdateTypeDto } from './type.dto';

@ApiTags('反馈类型')
@Controller('feedback/type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建反馈类型' })
  create(@Body() createTypeDto: CreateTypeDto) {
    return this.typeService.create(createTypeDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取反馈类型列表' })
  findAll(@Query() query: TypeQueryDto) {
    return this.typeService.findAll(query);
  }

  @Get('options')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取反馈类型选项' })
  getTypeOptions() {
    return this.typeService.getTypeOptions();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取单个反馈类型详情' })
  findOne(@Param('id') id: string) {
    return this.typeService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新反馈类型' })
  update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
    return this.typeService.update(id, updateTypeDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除反馈类型' })
  remove(@Param('id') id: string) {
    return this.typeService.remove(id);
  }
}
