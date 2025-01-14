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
import { FaqService } from './faq.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/public/dto/page';
import { RequireLogin } from 'src/public/decorator/require_login.decorator';
import { FaqDto } from './faq.dto';
import { User } from 'src/public/decorator/route-user.decoratpr';

@ApiTags('反馈/常见问题')
@Controller('feedback/faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  @ApiOperation({ summary: '获取FAQ' })
  async findAll(@Query() query: PageDto) {
    return this.faqService.findAll(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: '获取FAQ详情' })
  @ApiParam({ name: 'id', description: 'FAQ ID' })
  async findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  @Get('/list')
  @ApiOperation({ summary: '获取所有FAQ 用户' })
  @RequireLogin()
  async findAllUser() {
    return this.faqService.findAllUser();
  }

  @Post()
  @ApiOperation({ summary: '创建FAQ' })
  @ApiBody({ type: FaqDto })
  async create(@Body() data: FaqDto, @User('_id') user: string) {
    return this.faqService.create(data, user);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新FAQ' })
  @ApiParam({ name: 'id', description: 'FAQ ID' })
  @ApiBody({ type: FaqDto })
  async update(
    @Param('id') id: string,
    @Body() data: FaqDto,
    @User('_id') user: string,
  ) {
    return this.faqService.update(id, data, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除FAQ' })
  @ApiParam({ name: 'id', description: 'FAQ ID' })
  async delete(@Param('id') id: string) {
    return this.faqService.delete(id);
  }
}
