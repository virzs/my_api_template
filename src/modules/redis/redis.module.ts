import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  exports: [RedisModule],
})
export class RedisModule {}
