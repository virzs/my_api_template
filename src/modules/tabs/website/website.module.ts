import { Module } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';
import { ClassifyModule } from './classify/classify.module';
import { TagModule } from './tag/tag.module';

@Module({
  controllers: [WebsiteController],
  providers: [WebsiteService],
  imports: [ClassifyModule, TagModule],
})
export class WebsiteModule {}
