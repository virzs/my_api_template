import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateFeedbackDto,
  FeedbackQueryDto,
  UpdateFeedbackDto,
} from './dto/feedback.dto';

@ApiTags('反馈')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建反馈' })
  create(@Body() createFeedbackDto: CreateFeedbackDto, @Req() req) {
    return this.feedbackService.create(createFeedbackDto, req.user._id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取反馈列表' })
  findAll(@Query() query: FeedbackQueryDto) {
    return this.feedbackService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取单个反馈详情' })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新反馈' })
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
    @Req() req,
  ) {
    return this.feedbackService.update(id, updateFeedbackDto, req.user._id);
  }

  @Post(':id/reply')
  @ApiBearerAuth()
  @ApiOperation({ summary: '回复反馈' })
  reply(@Param('id') id: string, @Body('content') content: string, @Req() req) {
    return this.feedbackService.reply(id, content, req.user._id);
  }

  @Post(':id/assign/:handlerId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '分配处理人' })
  assignHandler(
    @Param('id') id: string,
    @Param('handlerId') handlerId: string,
    @Req() req,
  ) {
    return this.feedbackService.assignHandler(id, handlerId, req.user._id);
  }
}
