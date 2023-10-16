import { Module } from '@nestjs/common';
import { WebsiteClassifyService } from './website-classify.service';
import { WebsiteClassifyController } from './website-classify.controller';

@Module({
  controllers: [WebsiteClassifyController],
  providers: [WebsiteClassifyService]
})
export class WebsiteClassifyModule {}
