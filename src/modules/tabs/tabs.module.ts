import { Module } from '@nestjs/common';
import { TabsService } from './tabs.service';
import { TabsController } from './tabs.controller';
import { WebsiteModule } from './website/website.module';
import { GalleryModule } from './gallery/gallery.module';
import { GalleryClassifyModule } from './gallery-classify/gallery-classify.module';
import { UserDataModule } from './user-data/user-data.module';
import { SearchEngineModule } from './search-engine/search-engine.module';
import { GalleryTagModule } from './gallery-tag/gallery-tag.module';

@Module({
  controllers: [TabsController],
  providers: [TabsService],
  imports: [
    WebsiteModule,
    GalleryModule,
    GalleryClassifyModule,
    UserDataModule,
    SearchEngineModule,
    GalleryTagModule,
  ],
})
export class TabsModule {}
