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
import { TagService } from './tag.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RequireLogin } from 'src/public/decorator/require_login.decorator';
import { User } from 'src/public/decorator/route-user.decoratpr';
import {
  TagDto,
  TagForAdminDto,
  TagForUserDto,
  UpdateTagDto,
  TagWebsiteRelationDto,
  BatchUpdateTagStatusDto,
} from '../dto/tag';

@ApiTags('新标签页/标签')
@Controller('tabs/website/tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/')
  @ApiOperation({ summary: '标签分页 (后台)' })
  @ApiParam({ name: 'page', description: '页码', example: 1 })
  @ApiParam({ name: 'pageSize', description: '每页数量', example: 10 })
  @ApiParam({ name: 'search', description: '搜索关键词', required: false })
  @ApiParam({ name: 'enable', description: '是否启用', required: false })
  @RequireLogin()
  getTags(@Query() query: TagForAdminDto) {
    return this.tagService.getTags(query);
  }

  @Get('/user')
  @ApiOperation({ summary: '标签分页 (用户)' })
  @ApiParam({ name: 'page', description: '页码', example: 1 })
  @ApiParam({ name: 'pageSize', description: '每页数量', example: 10 })
  @ApiParam({ name: 'search', description: '搜索关键词', required: false })
  getTagsForUser(@Query() query: TagForUserDto) {
    return this.tagService.getTagsForUser(query);
  }

  @Get('/all')
  @ApiOperation({ summary: '获取所有启用的标签' })
  getAllEnabledTags() {
    return this.tagService.getAllEnabledTags();
  }

  @Post('/')
  @ApiOperation({ summary: '创建标签' })
  @RequireLogin()
  createTag(@Body() body: TagDto, @User('_id') user: string) {
    return this.tagService.createTag(body, user);
  }

  @Put('/batch-status')
  @ApiOperation({ summary: '批量更新标签状态' })
  @RequireLogin()
  batchUpdateTagStatus(@Body() body: BatchUpdateTagStatusDto) {
    return this.tagService.batchUpdateTagStatus(body);
  }

  @Post('/relation')
  @ApiOperation({ summary: '添加标签与网站的关联关系' })
  @RequireLogin()
  addTagWebsiteRelation(@Body() body: TagWebsiteRelationDto) {
    return this.tagService.manageTagWebsiteRelation(body, 'add');
  }

  @Delete('/relation')
  @ApiOperation({ summary: '移除标签与网站的关联关系' })
  @RequireLogin()
  removeTagWebsiteRelation(@Body() body: TagWebsiteRelationDto) {
    return this.tagService.manageTagWebsiteRelation(body, 'remove');
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新标签' })
  @RequireLogin()
  updateTag(
    @Param('id') id: string,
    @Body() body: UpdateTagDto,
    @User('_id') user: string,
  ) {
    return this.tagService.updateTag(id, body, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除标签' })
  @RequireLogin()
  deleteTag(@Param('id') id: string) {
    return this.tagService.deleteTag(id);
  }

  @Get('/:id')
  @ApiOperation({ summary: '标签详情' })
  getTagDetail(@Param('id') id: string) {
    return this.tagService.getTagDetail(id);
  }
}
