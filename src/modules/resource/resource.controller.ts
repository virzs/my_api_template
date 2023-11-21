import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { RequireLogin } from 'src/public/decorator/require_login.decorator';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('资源')
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  // 上传文件
  @Post('/:dir')
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('file'))
  @RequireLogin()
  async uploadFile(
    @Param('dir') dir: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.resourceService.uploadFile(dir, file);
    return result;
  }
}
