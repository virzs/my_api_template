import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Version, VersionName } from './schemas/version';
import { Model } from 'mongoose';
import { PageDto } from 'src/public/dto/page';
import { Response } from 'src/utils/response';
import { VersionDto } from './dto/version.dto';

@Injectable()
export class VersionService {
  constructor(
    @InjectModel(VersionName) private readonly versionModel: Model<Version>,
  ) {}

  async page(query: PageDto) {
    const { page = 1, pageSize = 10 } = query;

    const roles = await this.versionModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('permissions')
      .exec();

    const total = await this.versionModel.countDocuments();

    return Response.page(roles, { page, pageSize, total });
  }

  async create(body: VersionDto) {
    const role = await this.versionModel.create(body);
    return role;
  }

  async update(id: string, body: VersionDto) {
    const role = await this.versionModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return role;
  }

  async delete(id: string) {
    const role = await this.versionModel.findByIdAndDelete(id);
    return role;
  }

  //   获取最新的版本，根据平台
  async latest(platform: string) {
    const role = await this.versionModel
      .findOne({ platform })
      .sort({ createTime: -1 })
      .exec();
    return role;
  }

  async detail(id: string) {
    const role = await this.versionModel.findById(id);
    return role;
  }
}
