import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WebsiteName } from './schemas/ref-names';
import { Model } from 'mongoose';
import { Website } from './schemas/website';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { PageDto } from 'src/public/dto/page';
import { Response } from 'src/utils/response';
import { WebsiteDto, WebsitesForUserDto } from './dto/website';

@Injectable()
export class WebsiteService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(WebsiteName) private websiteModel: Model<Website>,
  ) {}

  /**
   * 获取网站分页 后台
   */
  async getWebsites(query: PageDto) {
    const { page = 1, pageSize = 10 } = query;

    const users = await this.websiteModel
      .find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('roles')
      .exec();

    const total = await this.websiteModel.countDocuments({});

    return Response.page(users, { page, pageSize, total });
  }

  /**
   * 获取网站分页 用户
   */
  async getWebsitesForUser(query: WebsitesForUserDto) {
    const { page = 1, pageSize = 10, tags, classify, search } = query;

    const finder = {
      enable: true,
      public: true,
      ...(tags && { tags: { $all: tags } }),
      ...(classify && { classify }),
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { url: { $regex: search, $options: 'i' } },
        ],
      }),
    };

    const users = await this.websiteModel
      .find(finder)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('roles')
      .exec();

    const total = await this.websiteModel.countDocuments(finder);

    return Response.page(users, { page, pageSize, total });
  }

  /**
   * 我创建的网站分页
   */
  async getMyWebsites(query: PageDto, user: string) {
    const { page = 1, pageSize = 10 } = query;

    const finder = { creator: user };

    const users = await this.websiteModel
      .find(finder)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('roles')
      .exec();

    const total = await this.websiteModel.countDocuments(finder);

    return Response.page(users, { page, pageSize, total });
  }

  /**
   * 新增网站
   */
  async addWebsite(data: WebsiteDto, user: string) {
    const website = new this.websiteModel({
      ...data,
      creator: user,
    });
    return website.save();
  }

  /**
   * 更新网站
   */
  async updateWebsite(id: string, data: WebsiteDto, user: string) {
    return this.websiteModel.findByIdAndUpdate(id, {
      ...data,
      updater: user,
    });
  }

  /**
   * 删除网站
   */
  async deleteWebsite(id: string) {
    return this.websiteModel.findByIdAndUpdate(id, { isDelete: true });
  }

  /**
   * 缓存点击数
   * @param id
   */
  async incrementClick(id: string): Promise<void> {
    const cacheKey = `website:${id}:click`;
    const currentClicks = (await this.cacheManager.get<number>(cacheKey)) || 0;
    await this.cacheManager.set(cacheKey, currentClicks + 1, 2 * 60 * 1000);
  }

  /**
   * 同步点击数
   */
  @Cron('0 * * * * *') // 每分钟同步一次点击数
  async syncClicks(): Promise<void> {
    const keys = await this.cacheManager.store.keys('website:*:click');
    if (!keys) return;
    for (const key of keys) {
      const id = key.split(':')[1];
      const clicks = await this.cacheManager.get<number>(key);
      if (clicks !== null) {
        await this.websiteModel.findByIdAndUpdate(id, { click: clicks });
        await this.cacheManager.del(key);
      }
    }
  }

  /**
   * 获取前50点击量的记录
   */
  async getTop50Clicks() {
    return this.websiteModel.find().sort({ click: -1 }).limit(50).exec();
  }

  /**
   * 每小时更新一次前50点击量排行
   */
  @Cron('0 0 * * * *') // 每小时执行一次
  async updateTop50Clicks() {
    const top50Clicks = await this.getTop50Clicks();
    await this.cacheManager.set('top50Clicks', top50Clicks, 2 * 60 * 60 * 1000);
    return top50Clicks;
  }

  /**
   * 从缓存中获取前50点击量的记录
   */
  async getTop50ClicksFromCache() {
    const top = this.cacheManager.get<Website[]>('top50Clicks');
    if (top) return top;
    // 缓存中没有则更新一次
    return await this.updateTop50Clicks();
  }
}
