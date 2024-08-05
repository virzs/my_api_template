import { Module } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WebsiteClassifyName,
  WebsiteName,
  WebsiteTagName,
} from './schemas/ref-names';
import { WebsiteSchema } from './schemas/website';
import { WebsiteClassifySchema } from './schemas/classify';
import { WebsiteTagSchema } from './schemas/tag';
import { ClassifyController } from './classify/classify.controller';
import { TagController } from './tag/tag.controller';
import { ClassifyService } from './classify/classify.service';
import { TagService } from './tag/tag.service';

@Module({
  controllers: [WebsiteController, ClassifyController, TagController],
  providers: [WebsiteService, ClassifyService, TagService],
  imports: [
    MongooseModule.forFeature([
      {
        name: WebsiteName,
        schema: WebsiteSchema,
      },
      {
        name: WebsiteClassifyName,
        schema: WebsiteClassifySchema,
      },
      {
        name: WebsiteTagName,
        schema: WebsiteTagSchema,
      },
    ]),
  ],
})
export class WebsiteModule {}
