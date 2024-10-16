import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetVisitUrlsDto } from './dto/upload.dto';
import { PageDto } from 'src/public/dto/page';
import { User } from 'src/public/decorator/route-user.decoratpr';

@ApiTags('资源')
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  // 上传文件
  @Post('/:dirs')
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('dirs') dir: string,
    @UploadedFile() file: Express.Multer.File,
    @User('_id') user: string,
  ) {
    const result = await this.resourceService.uploadFile(dir, file, user);
    return result;
  }

  // 批量获取访问链接
  @Get('/urls')
  @ApiOperation({ summary: '批量获取访问链接' })
  async getVisitUrls(@Query() query: GetVisitUrlsDto) {
    const result = await this.resourceService.getVisitUrls(query.ids);
    return result;
  }

  // 获取访问链接
  @Get('/url/:id')
  @ApiOperation({ summary: '获取访问链接' })
  async getVisitUrl(@Param('id') id: string) {
    const result = await this.resourceService.getVisitUrl(id);
    return result;
  }

  // 资源详情
  @Get('/objects/:id')
  @ApiOperation({ summary: '资源详情' })
  async detail(@Param('id') id: string) {
    return await this.resourceService.getResourceDetail(id);
  }

  // 列表
  @Get('/:service?')
  @ApiOperation({ summary: '列表' })
  @ApiParam({ name: 'page', description: '页码', example: 1 })
  @ApiParam({ name: 'pageSize', description: '每页数量', example: 10 })
  async list(@Param('service') service: string, @Query() query: PageDto) {
    return await this.resourceService.list(query, service);
  }

  // 获取单个资源所有关联数据
  @Get('/association/:id')
  @ApiOperation({ summary: '获取单个资源所有关联数据' })
  async getAssociation(@Param('id') id: string) {
    return await this.resourceService.getAssociatedData(id);
  }
}
