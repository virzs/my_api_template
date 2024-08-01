import { Controller } from '@nestjs/common';
import { GalleryTagService } from './gallery-tag.service';

@Controller('gallery-tag')
export class GalleryTagController {
  constructor(private readonly galleryTagService: GalleryTagService) {}
}
