import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { WebsiteClassifyName, WebsiteName } from '../schemas/ref-names';
import { WebsiteClassify } from '../schemas/classify';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { WebsiteClassifyDto } from '../dto/classify';
import { Website } from '../schemas/website';

@Injectable()
export class ClassifyService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(WebsiteClassifyName)
    private classifyModel: Model<WebsiteClassify>,
    @InjectModel(WebsiteName) private websiteModel: Model<Website>,
  ) {}

  async createClassify(data: WebsiteClassifyDto, user: string) {
    if (data.parent) {
      const parent = await this.classifyModel.findById(data.parent);
      if (!parent) {
        throw new Error('父分类不存在');
      } else if (parent.websites.length > 0) {
        throw new Error('父分类下存在网站，不允许创建子分类');
      }
    }
    return await this.classifyModel.create({ ...data, creator: user });
  }

  async updateClassify(id: string, data: WebsiteClassifyDto, user: string) {
    return await this.classifyModel.findByIdAndUpdate(id, {
      ...data,
      updater: user,
    });
  }

  async deleteClassify(id: string) {
    // 如果有子分类 禁止删除
    const children = await this.classifyModel.find({ parent: id });
    if (children.length > 0) {
      throw new Error('存在子分类，不允许删除');
    }
    const result = await this.classifyModel.findByIdAndUpdate(id, {
      isDelete: true,
    });

    // 如果分类删除 取消对应的关联
    await this.websiteModel.updateMany(
      { classify: id },
      { $set: { classify: null } },
    );

    return result;
  }

  async toggleWebsite(classifyId: string, websiteId: string) {
    const classify = await this.classifyModel.findById(classifyId);
    if (!classify) {
      throw new Error('分类未找到');
    }

    const updateOperation = classify.websites.includes(
      websiteId as unknown as any,
    )
      ? { $pull: { websites: websiteId } }
      : { $addToSet: { websites: websiteId } };

    await this.classifyModel.findByIdAndUpdate(classifyId, updateOperation);
  }

  async getTree(params?: any, parentId = null) {
    const result = await this.classifyModel.find({
      parent: parentId,
      name: new RegExp(params?.name ?? '', 'i'),
    });
    for (let i = 0; i < result.length; i++) {
      const children = await this.getTree(params, result[i]._id);
      if (children.length > 0) {
        // children 排序，如果有 children 则按创建时间排到前面，如果没有 则按创建时间排序
        children.sort((a, b) => {
          if (a.children && b.children) {
            return a.createdAt.getTime() - b.createdAt.getTime();
          } else if (a.children && !b.children) {
            return -1;
          } else if (!a.children && b.children) {
            return 1;
          } else {
            return a.createdAt.getTime() - b.createdAt.getTime();
          }
        });
        result[i].children = children;
      } else {
        result[i].children = null;
      }
    }
    return result;
  }

  /**
   * 获取详情
   */
  async detail(id: string) {
    return await this.classifyModel.findById(id, {
      websites: 0,
    });
  }

  /**
   * 获取分类树
   */
  async treeInfo(query: any) {
    return await this.getTree(query);
  }

  /**
   * 缓存分类树
   */
  async cacheTree() {
    const tree = await this.getTree();
    await this.cacheManager.set(
      'website_classify_tree',
      tree,
      2 * 60 * 60 * 1000,
    );
    return tree;
  }

  /**
   * 每小时更新一次分类树
   */
  @Cron('0 0 * * * *')
  async updateClassifyTree() {
    await this.cacheTree();
  }

  /**
   * 从缓存中获取分类树，没有则重新获取并缓存
   */
  async getClassifyTree() {
    const tree = await this.cacheManager.get('website_classify_tree');
    if (!tree) {
      return await this.cacheTree();
    }
    return tree;
  }
}
