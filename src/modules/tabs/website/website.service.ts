import { Inject, Injectable } from '@nestjs/common';
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
  WebsiteForAdminDto,
  WebsitesForUserDto,
} from './dto/website';
import { ClassifyService } from './classify/classify.service';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

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
  async getWebsites(query: WebsiteForAdminDto) {
    const { page = 1, pageSize = 10, classifyIds } = query;
    const classifyIdsArr = ![null, undefined, ''].includes(classifyIds)
      ? classifyIds.split(',')
      : [];

    // 构建查询条件
    const finder = {};

    // 处理分类筛选
    if (classifyIdsArr.length > 0) {
      finder['classify'] = { $in: classifyIdsArr };
    }

    const users = await this.websiteModel
      .find(finder)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('classify')
      .exec();

    const total = await this.websiteModel.countDocuments(finder);

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
      ...(classify && { classify }), // 保持这个不变，只有当指定了分类时才筛选
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
      await this.classifyService.toggleWebsite(
        data.classify,
        website._id as string,
      );
    }
    return website;
  }

  /**
   * 更新网站
   */
  async updateWebsite(id: string, data: WebsiteDto, user: string) {
    // 先获取当前网站的信息，以便检查分类是否有变化
    const currentWebsite = await this.websiteModel.findById(id);
    if (!currentWebsite) {
      throw new Error('网站不存在');
    }

    // 获取当前网站的分类ID（如果有）
    const oldClassifyId = currentWebsite.classify
      ? (currentWebsite.classify as unknown as string)
      : null;

    // 获取新的分类ID（如果有）
    const newClassifyId = data.classify || null;

    // 更新网站信息
    const result = await this.websiteModel.findByIdAndUpdate(id, {
      ...data,
      updater: user,
    }); // 处理分类变更
    // 如果旧分类与新分类不同，需要进行处理
    if (oldClassifyId !== newClassifyId) {
      // 如果旧分类存在，需要从旧分类中移除网站
      if (oldClassifyId) {
        await this.classifyService.toggleWebsite(oldClassifyId, id);
      }

      // 如果新分类存在，需要将网站添加到新分类
      if (newClassifyId) {
        await this.classifyService.toggleWebsite(newClassifyId, id);
      }
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
        const description = $('meta[name="description"]').attr('content');

        // 收集所有可能的图标
        const icons = [
          $('link[rel="icon"]').attr('href'),
          $('link[rel="shortcut icon"]').attr('href'),
          $('link[rel="apple-touch-icon"]').attr('href'),
          $('link[rel="apple-touch-icon-precomposed"]').attr('href'),
        ].filter(Boolean);

        // 使用第一个有效的图标
        const icon = icons.length > 0 ? icons[0] : null;

        return { title, description, icon, icons };
      })
      .catch(() => {
        return {};
      });

    if (Object.keys(result).length !== 0) {
      await this.cacheManager.set(
        `website:meta:${url}`,
        result,
        24 * 60 * 60 * 1000,
      );
    }
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
