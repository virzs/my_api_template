import { Controller } from '@nestjs/common';
import { WebsiteTagService } from './website-tag.service';

@Controller('website-tag')
export class WebsiteTagController {
  constructor(private readonly websiteTagService: WebsiteTagService) {}
}
