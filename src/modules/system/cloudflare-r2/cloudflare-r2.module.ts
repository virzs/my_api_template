import { Module } from '@nestjs/common';
import { CloudflareR2Service } from './cloudflare-r2.service';
import { CloudflareR2Controller } from './cloudflare-r2.controller';

@Module({
  controllers: [CloudflareR2Controller],
  providers: [CloudflareR2Service],
  exports: [CloudflareR2Service],
})
export class CloudflareR2Module {}
