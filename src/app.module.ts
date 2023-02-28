import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import db from './config/db';
import { UsersModule } from './modules/users/users.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ['development.env', 'production.env'],
      ignoreEnvFile: false,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [db],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config) => config.get('MongoConfig'),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
