import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MySiteBlog, MySiteBlogSchemaName } from './blog.schema';
import { Model } from 'mongoose';
import { PageDto } from 'src/public/dto/page';
import { Response } from 'src/utils/response';
import { BlogDto } from './blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(MySiteBlogSchemaName)
    private readonly blogModel: Model<MySiteBlog>,
  ) {}

  /**
   * 分页获取博客
   */
  async getBlogs(query: PageDto) {
    const { page = 1, pageSize = 10 } = query;

    const users = await this.blogModel
      .find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('classify')
      .exec();

    const total = await this.blogModel.countDocuments({});

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
    return await this.blogModel.findByIdAndUpdate(id, {
      ...body,
      updater,
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
}
