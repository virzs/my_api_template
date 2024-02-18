import { Module } from '@nestjs/common';
import { ReptileService } from './reptile.service';
import { ReptileController } from './reptile.controller';
import { BtbttModule } from './btbtt/btbtt.module';

@Module({
  controllers: [ReptileController],
  providers: [ReptileService],
  imports: [BtbttModule],
})
export class ReptileModule {}
