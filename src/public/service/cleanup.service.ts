import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Connection } from 'mongoose';

/**
 * 定时清理服务
 */
@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(@InjectConnection() private connection: Connection) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldData() {
    this.logger.log('开始清理过期数据...');
    const collections = await this.connection.db.collections();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    for (const collection of collections) {
      const result = await collection.deleteMany({
        isDelete: true,
        updatedAt: { $lt: sixtyDaysAgo },
      });

      result.deletedCount > 0 &&
        this.logger.log(
          `集合 ${collection.collectionName} 清理完成，删除了 ${result.deletedCount} 条记录`,
        );
    }

    this.logger.log('所有集合清理完成');
  }
}
