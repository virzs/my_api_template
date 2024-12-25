import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Connection } from 'mongoose';

/**
 * 定时清理服务
 */
@Injectable()
export class CleanupService {
  constructor(@InjectConnection() private connection: Connection) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldData() {
    const collections = await this.connection.db.collections();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    for (const collection of collections) {
      await collection.deleteMany({
        isDelete: true,
        updatedAt: { $lt: sixtyDaysAgo },
      });
    }
  }
}
