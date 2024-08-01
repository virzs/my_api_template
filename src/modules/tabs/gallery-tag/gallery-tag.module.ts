import { Module } from '@nestjs/common';
import { GalleryTagService } from './gallery-tag.service';
import { GalleryTagController } from './gallery-tag.controller';

@Module({
  controllers: [GalleryTagController],
  providers: [GalleryTagService]
})
export class GalleryTagModule {}
