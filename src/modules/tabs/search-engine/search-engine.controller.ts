import { Controller } from '@nestjs/common';
import { SearchEngineService } from './search-engine.service';

@Controller('search-engine')
export class SearchEngineController {
  constructor(private readonly searchEngineService: SearchEngineService) {}
}
