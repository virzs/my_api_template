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

    const versions = await this.versionModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('creator')
      .populate('updater')
      .exec();

    const total = await this.versionModel.countDocuments();

    return Response.page(versions, { page, pageSize, total });
  }

  async create(body: VersionDto, user: string) {
    const version = await this.versionModel.create({ ...body, creator: user });
    return version;
  }

  async update(id: string, body: VersionDto, user: string) {
    const version = await this.versionModel.findByIdAndUpdate(
      id,
      { ...body, updater: user },
      {
        new: true,
      },
    );
    return version;
  }

  async delete(id: string) {
    const version = await this.versionModel.findByIdAndUpdate(id, {
      isDelete: true,
    });
    return version;
  }

  //   获取最新的版本，根据平台
  async latest(platform: string) {
    const version = await this.versionModel
      .findOne({
        platform,
        isDelete: false,
        releaseTime: { $exists: false, $lte: new Date() },
      })
      .sort({ createTime: -1 })
      .exec();
    return version;
  }

  async detail(id: string) {
    const version = await this.versionModel.findById(id);
    return version;
  }
}
