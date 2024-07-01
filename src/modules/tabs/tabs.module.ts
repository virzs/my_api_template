import { Module } from '@nestjs/common';
import { TabsService } from './tabs.service';
import { TabsController } from './tabs.controller';
import { WebsiteModule } from './website/website.module';
import { WebsiteClassifyModule } from './website-classify/website-classify.module';
import { GalleryModule } from './gallery/gallery.module';
import { GalleryClassifyModule } from './gallery-classify/gallery-classify.module';
import { UserDataModule } from './user-data/user-data.module';
import { SearchEngineModule } from './search-engine/search-engine.module';
import { WebsiteTagModule } from './website-tag/website-tag.module';
import { GalleryTagModule } from './gallery-tag/gallery-tag.module';

@Module({
  controllers: [TabsController],
  providers: [TabsService],
  imports: [
    WebsiteModule,
    WebsiteClassifyModule,
    GalleryModule,
    GalleryClassifyModule,
    UserDataModule,
    SearchEngineModule,
    WebsiteTagModule,
    GalleryTagModule,
  ],
})
export class TabsModule {}
