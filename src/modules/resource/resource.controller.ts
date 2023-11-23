import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
    console.log(dir);
    const result = await this.resourceService.uploadFile(dir, file);
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
