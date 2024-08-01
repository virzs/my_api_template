import { Module } from '@nestjs/common';
import { WebsiteTagService } from './website-tag.service';
import { WebsiteTagController } from './website-tag.controller';

@Module({
  controllers: [WebsiteTagController],
  providers: [WebsiteTagService]
})
export class WebsiteTagModule {}
