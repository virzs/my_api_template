import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule],
  providers: [
    // redis 连接配置
    {
      provide: 'REDIS_CLIENT',
      useFactory: (config) => config.get('redis'),
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisModule],
})
export class RedisModule {}
