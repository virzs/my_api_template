import { Controller } from '@nestjs/common';
import { GalleryClassifyService } from './gallery-classify.service';

@Controller('gallery-classify')
export class GalleryClassifyController {
  constructor(private readonly galleryClassifyService: GalleryClassifyService) {}
}
