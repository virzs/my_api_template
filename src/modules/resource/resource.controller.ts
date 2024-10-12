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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetVisitUrlsDto } from './dto/upload.dto';

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
  ) {
    const result = await this.resourceService.uploadFile(dir, file);
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
  @Get('/:id')
  @ApiOperation({ summary: '获取访问链接' })
  async getVisitUrl(@Param('id') id: string) {
    const result = await this.resourceService.getVisitUrl(id);
    return result;
  }
}
