import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MySiteBlog,
  MySiteBlogOperationRecord,
  MySiteBlogOperationRecordSchemaName,
  MySiteBlogSchemaName,
} from './blog.schema';
import { Model } from 'mongoose';
import { PageDto } from 'src/public/dto/page';
import { Response } from 'src/utils/response';
import { BlogDto, BlogPageDto } from './blog.dto';
import { UsersName } from 'src/modules/users/schemas/ref-names';
import { ResourceService } from 'src/modules/resource/resource.service';
import { JSDOM } from 'jsdom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore marked 没有类型定义
import { parse } from 'marked';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore dompurify 没有类型定义
import * as DOMPurify from 'dompurify';
import { Resource } from 'src/modules/resource/schemas/resource';

// 创建一个 JSDOM 实例
const window = new JSDOM('').window;
const purify = DOMPurify(window);

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(MySiteBlogSchemaName)
    private readonly blogModel: Model<MySiteBlog>,
    @InjectModel(MySiteBlogOperationRecordSchemaName)
    private readonly blogRecordModel: Model<MySiteBlogOperationRecord>,
    @Inject(forwardRef(() => ResourceService))
    private readonly resourceService: ResourceService,
  ) {}

  private async getResourceByImageUrl(
    imageUrl: string,
  ): Promise<Resource | null> {
    const url = new URL(imageUrl);
    const key = url.pathname.split('/').pop(); // 提取文件名部分
    return await this.resourceService.getResourceByKey(`blog/${key}`);
  }

  /**
   * 分页获取博客
   */
  async getBlogs(query: PageDto) {
    const { page = 1, pageSize = 10 } = query;

    const users = await this.blogModel
      .find({}, { content: 0 })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await this.blogModel.countDocuments({});

    return Response.page(users, { page, pageSize, total });
  }

  /**
   * 分页获取博客 用户
   */
  async getBlogsForUser(query: BlogPageDto) {
    const { page = 1, pageSize = 10, startDate, endDate } = query;

    const dateFilter: any = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    const filter = {
      isPublish: true,
      ...(startDate || endDate ? { createdAt: dateFilter } : {}),
    };

    const blogs = await this.blogModel
      .find(filter)
      .sort({ createdAt: -1 }) // 按时间倒序排列
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await this.blogModel.countDocuments(filter);

    // 生成简介
    const blogsWithSummary = blogs.map((blog) => {
      const { content, ...rest } = blog.toObject();
      const sanitizedContent = purify.sanitize(parse(content || '') as string, {
        ALLOWED_TAGS: ['p'],
        FORBID_CONTENTS: ['a', 'code', 'img', 'pre', 'table', 'ul', 'ol', 'li'],
        FORBID_TAGS: ['p'],
      }); // 解析markdown并仅保留h和p标签

      // 去除所有HTML标签和换行符
      const plainText = sanitizedContent
        .replace(/<[^>]+>/g, '')
        .replace(/\n/g, '');

      return {
        ...rest,
        summary: plainText.substring(0, 100), // 截取前100个字符作为简介
      };
    });

    return Response.page(blogsWithSummary, { page, pageSize, total });
  }

  /**
   * 新增
   */
  async addBlog(body: BlogDto, creator: string) {
    const result = await this.blogModel.create({
      ...body,
      creator,
    });

    const { cover, content } = result;

    await this.resourceService.associateResourcesFromStringOrArray({
      associatedDataId: result._id as string,
      associatedDataFrom: MySiteBlogSchemaName,
      resources: cover ? [cover] : [],
      content,
    });

    return result;
  }

  /**
   * 更新
   */
  async updateBlog(id: string, body: BlogDto, updater: string) {
    const old = await this.blogModel.findById(id);

    const newOperationRecord = {
      operator: updater,
      type: 'update',
      change: old,
    };

    const record = await this.blogRecordModel.create(newOperationRecord);

    const updatedBlog = await this.blogModel.findByIdAndUpdate(id, {
      ...body,
      updater,
      isPublish: false,
      $push: { operationRecord: record._id },
    });

    const { cover, content } = body;

    await this.resourceService.associateResourcesFromStringOrArray({
      associatedDataId: id,
      associatedDataFrom: MySiteBlogSchemaName,
      resources: cover ? [cover] : [],
      content,
    });

    return updatedBlog;
  }

  /**
   * 删除
   */
  async deleteBlog(id: string) {
    const blog = await this.blogModel.findByIdAndUpdate(id, {
      isDelete: true,
    });

    if (blog) {
      await this.resourceService.disassociateDataAndResourceByDataId(id);
    }

    return blog;
  }

  /**
   * 发布
   */
  async publishBlog(id: string, user: string) {
    const old = await this.blogModel.findById(id);

    const newOperationRecord = {
      operator: user,
      type: old.isPublish ? 'unpublish' : 'publish',
    };

    const record = await this.blogRecordModel.create(newOperationRecord);

    return await this.blogModel
      .findByIdAndUpdate(id, {
        isPublish: !old.isPublish,
        publishTime: !old.isPublish ? null : new Date(),
        publisher: !old.isPublish ? null : user,
        $push: { operationRecord: record._id },
      })
      .exec();
  }

  /**
   * 详情 后台
   */
  async getBlogDetail(id: string) {
    const blog = await this.blogModel
      .findById(id)
      .populate({
        path: 'operationRecord',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'operator',
          model: UsersName,
          select: 'username email _id',
        },
      })
      .exec();

    if (blog) {
      if (blog.content) {
        blog.content = await this.resourceService.replaceImageLinks(
          blog.content,
        );
      }
      if (blog.cover) {
        blog.cover.url = await this.resourceService.getVisitUrlByDetail(
          blog.cover,
        );
      }
    }

    return blog;
  }

  /**
   * 详情 用户
   */
  async getBlogDetailForUser(id: string): Promise<
    | (MySiteBlog & {
        prev: { _id: string; title: string } | null;
        next: { _id: string; title: string } | null;
      })
    | null
  > {
    const blog = await this.blogModel
      .findOne(
        { _id: id, isPublish: true },
        {
          creator: 0,
          updater: 0,
        },
      )
      .exec();

    if (blog) {
      const blogObject = blog.toObject() as MySiteBlog & {
        prev: { _id: string; title: string } | null;
        next: { _id: string; title: string } | null;
      };

      if (blogObject.content) {
        blogObject.content = await this.resourceService.replaceImageLinks(
          blogObject.content,
        );
      }
      if (blogObject.cover) {
        blogObject.cover.url = await this.resourceService.getVisitUrlByDetail(
          blogObject.cover,
        );
      }

      // 获取上一篇博客
      const prevBlog = await this.blogModel
        .findOne({ _id: { $lt: id }, isPublish: true })
        .sort({ _id: -1 })
        .exec();

      // 获取下一篇博客
      const nextBlog = await this.blogModel
        .findOne({ _id: { $gt: id }, isPublish: true })
        .sort({ _id: 1 })
        .exec();

      blogObject.prev = prevBlog
        ? { _id: prevBlog._id as string, title: prevBlog.title }
        : null;
      blogObject.next = nextBlog
        ? { _id: nextBlog._id as string, title: nextBlog.title }
        : null;

      return blogObject;
    }

    return null;
  }

  /**
   * 数据统计
   */
  async getBlogStatistics() {
    const today = new Date();

    const todayNewCount = await this.blogModel.countDocuments({
      isDelete: false,
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    });

    const yesterdayNewCount = await this.blogModel.countDocuments({
      isDelete: false,
      createdAt: {
        $gte: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 1,
        ),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    });

    const totalCount = await this.blogModel.countDocuments({
      isDelete: false,
    });

    const nowMonthCount = await this.blogModel.countDocuments({
      isDelete: false,
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), 1),
      },
    });

    const lastMonthCount = await this.blogModel.countDocuments({
      isDelete: false,
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        $lt: new Date(today.getFullYear(), today.getMonth(), 1),
      },
    });

    const nowWeekCount = await this.blogModel.countDocuments({
      isDelete: false,
      createdAt: {
        $gte: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - today.getDay(),
        ),
      },
    });

    const lastWeekCount = await this.blogModel.countDocuments({
      isDelete: false,
      createdAt: {
        $gte: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - today.getDay() - 7,
        ),
        $lt: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - today.getDay(),
        ),
      },
    });

    // 过去30天每天新增文章数量
    const last30Days = await Promise.all(
      Array.from({ length: 30 }).map(async (_, index) => {
        const date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - index,
        );
        const count = await this.blogModel.countDocuments({
          isDelete: false,
          createdAt: {
            $gte: date,
            $lt: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() + 1,
            ),
          },
        });

        return {
          date,
          count,
        };
      }),
    );

    const oneYearAgo = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate(),
    );

    // 获取从今天到去年的每一天的日期
    const dates = [];
    for (let d = new Date(today); d >= oneYearAgo; d.setDate(d.getDate() - 1)) {
      dates.push(new Date(d));
    }

    // 统计每一天的新增文章数
    const dailyCounts = await Promise.all(
      dates.map(async (date) => {
        const count = await this.blogModel.countDocuments({
          isDelete: false,
          createdAt: {
            $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            $lt: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() + 1,
            ),
          },
        });

        return {
          date,
          count,
        };
      }),
    );

    return {
      todayNewCount,
      yesterdayNewCount,
      totalCount,
      nowMonthCount,
      lastMonthCount,
      nowWeekCount,
      lastWeekCount,
      last30Days: (await Promise.all(last30Days)).sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
      }),
      dailyCounts: dailyCounts.sort(
        (a, b) => a.date.getTime() - b.date.getTime(),
      ),
    };
  }
}
