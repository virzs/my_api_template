import { Controller } from '@nestjs/common';
import { MySiteService } from './my-site.service';

@Controller('my-site')
export class MySiteController {
  constructor(private readonly mySiteService: MySiteService) {}
}
