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
import { BlogService } from './blog.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RequireLogin } from 'src/public/decorator/require_login.decorator';
import { BlogDto } from './blog.dto';
import { User } from 'src/public/decorator/route-user.decoratpr';
import { PageDto } from 'src/public/dto/page';

@ApiTags('我的网站/博客')
@Controller('my-site/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/')
  @ApiOperation({ summary: '博客分页 (后台)' })
  @ApiQuery({ type: PageDto })
  getBlog(@Query() query) {
    return this.blogService.getBlogs(query);
  }

  @Get('/user')
  @ApiOperation({ summary: '博客分页 (用户)' })
  @ApiQuery({ type: PageDto })
  @RequireLogin()
  getBlogForUser(@Query() query) {
    return this.blogService.getBlogsForUser(query);
  }

  @Get('/user/:id')
  @ApiOperation({ summary: '博客详情 (用户)' })
  @ApiParam({ name: 'id', description: '博客ID' })
  @RequireLogin()
  getBlogDetailForUser(@Param('id') id: string) {
    return this.blogService.getBlogDetailForUser(id);
  }

  @Put('/publish/:id')
  @ApiOperation({ summary: '发布博客' })
  @ApiParam({ name: 'id', description: '博客ID' })
  publishBlog(@Param('id') id: string, @User('_id') user: string) {
    return this.blogService.publishBlog(id, user);
  }

  @Get('/statistics')
  @ApiOperation({ summary: '博客统计' })
  getBlogStatistics() {
    return this.blogService.getBlogStatistics();
  }

  @Get('/:id')
  @ApiOperation({ summary: '博客详情' })
  @ApiParam({ name: 'id', description: '博客ID' })
  getBlogDetail(@Param('id') id: string) {
    return this.blogService.getBlogDetail(id);
  }

  @Post('/')
  @ApiOperation({ summary: '创建博客' })
  @ApiBody({ type: BlogDto })
  postBlog(@Body() body: BlogDto, @User('_id') user: string) {
    return this.blogService.addBlog(body, user);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新博客' })
  @ApiParam({ name: 'id', description: '博客ID' })
  @ApiBody({ type: BlogDto })
  putBlog(
    @Param('id') id: string,
    @Body() body: BlogDto,
    @User('_id') user: string,
  ) {
    return this.blogService.updateBlog(id, body, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除博客' })
  @ApiParam({ name: 'id', description: '博客ID' })
  deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }
}
