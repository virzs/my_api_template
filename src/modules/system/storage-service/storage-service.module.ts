import { Module } from '@nestjs/common';
import { CloudflareR2Service } from './cloudflare-r2/cloudflare-r2.service';
import { QiniuService } from './qiniu/qiniu.service';

@Module({
  providers: [CloudflareR2Service, QiniuService],
  exports: [CloudflareR2Service, QiniuService],
})
export class StorageServiceModule {}
