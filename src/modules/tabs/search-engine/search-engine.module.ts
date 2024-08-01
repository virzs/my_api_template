import { Module } from '@nestjs/common';
import { SearchEngineService } from './search-engine.service';
import { SearchEngineController } from './search-engine.controller';

@Module({
  controllers: [SearchEngineController],
  providers: [SearchEngineService]
})
export class SearchEngineModule {}
