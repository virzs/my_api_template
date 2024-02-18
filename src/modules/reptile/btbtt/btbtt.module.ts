import { Module } from '@nestjs/common';
import { BtbttService } from './btbtt.service';
import { BtbttController } from './btbtt.controller';

@Module({
  controllers: [BtbttController],
  providers: [BtbttService]
})
export class BtbttModule {}
