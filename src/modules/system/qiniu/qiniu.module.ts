import { Module } from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { QiniuController } from './qiniu.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [QiniuController],
  providers: [QiniuService],
  imports: [ConfigModule],
})
export class QiniuModule {}
