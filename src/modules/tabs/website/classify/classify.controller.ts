import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClassifyService } from './classify.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireLogin } from 'src/public/decorator/require_login.decorator';
import { WebsiteClassifyDto } from '../dto/classify';
import { User } from 'src/public/decorator/route-user.decoratpr';
@ApiTags('新标签页/网站/分类')
@Controller('tabs/website_classify')
export class ClassifyController {
  constructor(private readonly classifyService: ClassifyService) {}

  @Get('/')
  @ApiOperation({ description: '分类树' })
  treeInfo(@Param() query: any) {
    return this.classifyService.treeInfo(query);
  }

  @Get('/tree')
  @ApiOperation({ description: '分类树 (用户)' })
  @RequireLogin()
  treeInfoForUser() {
    return this.classifyService.getClassifyTree();
  }

  @Post('/')
  @ApiOperation({ description: '创建分类' })
  createClassify(@Body() body: WebsiteClassifyDto, @User('_id') user: string) {
    return this.classifyService.createClassify(body, user);
  }

  @Put('/:id')
  @ApiOperation({ description: '更新分类' })
  updateClassify(
    @Param('id') id: string,
    @Body() body: WebsiteClassifyDto,
    @User('_id') user: string,
  ) {
    return this.classifyService.updateClassify(id, body, user);
  }

  @Delete('/:id')
  @ApiOperation({ description: '删除分类' })
  deleteClassify(@Param('id') id: string) {
    return this.classifyService.deleteClassify(id);
  }
}
