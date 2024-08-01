import { Module } from '@nestjs/common';
import { WebsiteClassifyService } from './website-classify.service';
import { WebsiteClassifyController } from './website-classify.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TabsWebsiteClassifyName,
  TabsWebsiteClassifySchema,
} from './website-classify.schema';

@Module({
  controllers: [WebsiteClassifyController],
  providers: [WebsiteClassifyService],
  imports: [
    MongooseModule.forFeature([
      {
        name: TabsWebsiteClassifyName,
        schema: TabsWebsiteClassifySchema,
      },
    ]),
  ],
})
export class WebsiteClassifyModule {}
