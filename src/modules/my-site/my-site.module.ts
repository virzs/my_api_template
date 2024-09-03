import { Module } from '@nestjs/common';
import { MySiteService } from './my-site.service';
import { MySiteController } from './my-site.controller';
import { BlogModule } from './blog/blog.module';

@Module({
  controllers: [MySiteController],
  providers: [MySiteService],
  imports: [BlogModule]
})
export class MySiteModule {}
