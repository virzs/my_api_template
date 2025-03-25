import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRecordDto, RecordQueryDto } from './dto/record.dto';

@ApiTags('反馈记录')
@Controller('feedback/record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建反馈记录' })
  create(@Body() createRecordDto: CreateRecordDto, @Req() req) {
    return this.recordService.create(createRecordDto, req.user._id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取所有反馈记录' })
  findAll(@Query() query: RecordQueryDto) {
    return this.recordService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取单个反馈记录' })
  findOne(@Param('id') id: string) {
    return this.recordService.findById(id);
  }

  @Get('by-feedback/:feedbackId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取指定反馈的所有记录' })
  getRecordsByFeedback(@Param('feedbackId') feedbackId: string) {
    return this.recordService.getRecordsByFeedback(feedbackId);
  }
}
