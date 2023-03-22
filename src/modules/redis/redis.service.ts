import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async set(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.cacheManager.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
