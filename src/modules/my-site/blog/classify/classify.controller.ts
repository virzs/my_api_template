import { Controller } from '@nestjs/common';
import { ClassifyService } from './classify.service';

@Controller('classify')
export class ClassifyController {
  constructor(private readonly classifyService: ClassifyService) {}
}
