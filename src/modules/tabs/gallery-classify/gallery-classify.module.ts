import { Module } from '@nestjs/common';
import { GalleryClassifyService } from './gallery-classify.service';
import { GalleryClassifyController } from './gallery-classify.controller';

@Module({
  controllers: [GalleryClassifyController],
  providers: [GalleryClassifyService]
})
export class GalleryClassifyModule {}
