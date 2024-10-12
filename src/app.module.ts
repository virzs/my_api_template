import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { LoginGuard } from './public/guard/login.guard';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './public/guard/permission.guard';
import { ProjectModule } from './modules/system/project/project.module';
import { ResourceModule } from './modules/resource/resource.module';
import { TDPrintModule } from './modules/3d-print/3d-print.module';
import { QiniuModule } from './modules/system/qiniu/qiniu.module';
import { ReptileModule } from './modules/reptile/reptile.module';
import { VersionModule } from './modules/system/version/version.module';
import { TabsModule } from './modules/tabs/tabs.module';
import qiniu from './config/qiniu';
import rateLimit from 'express-rate-limit';
import { ScheduleModule } from '@nestjs/schedule';
import { MySiteModule } from './modules/my-site/my-site.module';
import { CloudflareR2Module } from './modules/system/cloudflare-r2/cloudflare-r2.module';
import cloudflareR2 from './config/cloudflare-r2';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['dev.env', 'prod.env'],
      ignoreEnvFile: false,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [db, redis, email, qiniu, cloudflareR2],
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
        // docker redis 配置时需要 url
        url: `redis://${config.get('redis.host')}:${config.get('redis.port')}`,
        // host: config.get('redis.host'),
        // port: config.get('redis.port'),
        ttl: config.get('redis.ttl'),
        auth_pass: config.get('redis.password'),
        database: config.get('redis.db'),
      }),
    }),
    // 定时任务
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    PermissionModule,
    EmailModule,
    RoleModule,
    ProjectModule,
    ResourceModule,
    TDPrintModule,
    QiniuModule,
    ReptileModule,
    VersionModule,
    TabsModule,
    MySiteModule,
    CloudflareR2Module,
  ],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {
  // 单个ip请求速率限制
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        rateLimit({
          windowMs: 60 * 1000,
          max: 100,
        }),
      )
      .forRoutes('*');
  }
}
