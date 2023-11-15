import { Controller } from '@nestjs/common';
import { QiniuService } from './qiniu.service';

@Controller('qiniu')
export class QiniuController {
  constructor(private readonly qiniuService: QiniuService) {}
}
