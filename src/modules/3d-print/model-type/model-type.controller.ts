import { Controller } from '@nestjs/common';
import { ModelTypeService } from './model-type.service';

@Controller('model-type')
export class ModelTypeController {
  constructor(private readonly modelTypeService: ModelTypeService) {}
}
