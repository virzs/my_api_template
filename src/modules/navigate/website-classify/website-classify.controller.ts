import { Controller } from '@nestjs/common';
import { WebsiteClassifyService } from './website-classify.service';

@Controller('website-classify')
export class WebsiteClassifyController {
  constructor(private readonly websiteClassifyService: WebsiteClassifyService) {}
}
