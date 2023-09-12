import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import db from './config/db';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import redis from './config/redis';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { PermissionModule } from './modules/system/permission/permission.module';
import { EmailModule } from './modules/system/email/email.module';
import { RoleModule } from './modules/system/role/role.module';
import email from './config/email';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['dev.env', 'prod.env'],
      ignoreEnvFile: false,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [db, redis, email],
    }),
    // mongoDB 连接配置
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('MongoConfig'),
      inject: [ConfigService],
    }),
    // 缓存配置 redis
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get('redis.host'),
        port: config.get('redis.port'),
        ttl: config.get('redis.ttl'),
        auth_pass: config.get('redis.password'),
        database: config.get('redis.db'),
      }),
    }),
    UsersModule,
    AuthModule,
    PermissionModule,
    EmailModule,
    RoleModule,
  ],
})
export class AppModule {}
