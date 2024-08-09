import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WebsiteName } from './schemas/ref-names';
import { Model } from 'mongoose';
import { Website } from './schemas/website';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { PageDto } from 'src/public/dto/page';
import { Response } from 'src/utils/response';
import {
  ParseWebsiteDto,
  UpdateWebsitePublicDto,
  WebsiteDto,
  WebsitesForUserDto,
} from './dto/website';
import { ClassifyService } from './classify/classify.service';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class WebsiteService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(WebsiteName) private websiteModel: Model<Website>,
    private readonly classifyService: ClassifyService,
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
      .populate('classify')
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
      .exec();

    const total = await this.websiteModel.countDocuments(finder);

    return Response.page(users, { page, pageSize, total });
  }

  /**
   * 新增网站
   */
  async addWebsite(data: WebsiteDto, user: string) {
    const website = await this.websiteModel.create({
      ...data,
      creator: user,
    });
    if (data.classify) {
      await this.classifyService.toggleWebsite(data.classify, website._id);
    }
    return website;
  }

  /**
   * 更新网站
   */
  async updateWebsite(id: string, data: WebsiteDto, user: string) {
    const result = this.websiteModel.findByIdAndUpdate(id, {
      ...data,
      updater: user,
    });

    if (data.classify) {
      await this.classifyService.toggleWebsite(data.classify, id);
    }

    return result;
  }

  /**
   * 修改是否公开 可批量
   */
  async updateWebsitePublic(body: UpdateWebsitePublicDto) {
    const { ids, isPublic } = body;

    console.log(ids, isPublic, 'xxxxxxxxxx');

    const result = await this.websiteModel.updateMany(
      { _id: { $in: ids } },
      { public: isPublic },
    );

    if (result) {
      return Response.success();
    } else {
      throw new Error('修改失败');
    }
  }

  /**
   * 删除网站
   */
  async deleteWebsite(id: string) {
    const result = await this.websiteModel.findByIdAndUpdate(id, {
      isDelete: true,
    });
    if (result.classify) {
      await this.classifyService.toggleWebsite(
        result.classify as unknown as string,
        id,
      );
    }
    return result;
  }

  /**
   * 详情
   */
  async detail(id: string) {
    return this.websiteModel.findById(id).exec();
  }

  /**
   * 根据url解析网站meta信息
   */
  async parseWebsiteMeta({ url, ignoreCache }: ParseWebsiteDto) {
    if (!ignoreCache) {
      // 先从缓存中获取
      const cacheResult: object = await this.cacheManager.get(
        `website:meta:${url}`,
      );
      if (cacheResult) return { ...cacheResult, isCache: true };
    }

    const result = await axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const title = $('title').text();
        const icon = $('link[rel="icon"]').attr('href');
        const icon2 = $('link[rel="shortcut icon"]').attr('href');
        const description = $('meta[name="description"]').attr('content');

        return { title, description, icon: icon ?? icon2 };
      })
      .catch(() => {
        return {};
      });
    // 如果获取成功，缓存解析结果，有效期1天
    await this.cacheManager.set(
      `website:meta:${url}`,
      result,
      24 * 60 * 60 * 1000,
    );
    return result;
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
