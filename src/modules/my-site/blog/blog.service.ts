import { Injectable } from '@nestjs/common';
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
import { BlogDto } from './blog.dto';
import { UsersName } from 'src/modules/users/schemas/ref-names';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(MySiteBlogSchemaName)
    private readonly blogModel: Model<MySiteBlog>,
    @InjectModel(MySiteBlogOperationRecordSchemaName)
    private readonly blogRecordModel: Model<MySiteBlogOperationRecord>,
  ) {}

  /**
   * 分页获取博客
   */
  async getBlogs(query: PageDto) {
    const { page = 1, pageSize = 10 } = query;

    const users = await this.blogModel
      .find({}, { content: 0 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await this.blogModel.countDocuments({});

    return Response.page(users, { page, pageSize, total });
  }

  /**
   * 分页获取博客 用户
   */
  async getBlogsForUser(query: PageDto) {
    const { page = 1, pageSize = 10 } = query;

    const users = await this.blogModel
      .find({ isPublish: true })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await this.blogModel.countDocuments({
      isPublish: true,
    });

    return Response.page(users, { page, pageSize, total });
  }

  /**
   * 新增
   */
  async addBlog(body: BlogDto, creator: string) {
    return await this.blogModel.create({
      ...body,
      creator,
    });
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

    return await this.blogModel.findByIdAndUpdate(id, {
      ...body,
      updater,
      isPublish: false,
      $push: { operationRecord: record._id },
    });
  }

  /**
   * 删除
   */
  async deleteBlog(id: string) {
    return await this.blogModel.findByIdAndUpdate(id, {
      isDelete: true,
    });
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
    return await this.blogModel
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
  }

  /**
   * 详情 用户
   */
  async getBlogDetailForUser(id: string) {
    return await this.blogModel
      .findOne(
        { _id: id, isPublish: true },
        {
          creator: 0,
          updater: 0,
        },
      )
      .exec();
  }
}
