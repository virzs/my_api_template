import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { The3dPrintFilamentInfo } from '../schemas/filament-info';
import { Model } from 'mongoose';
import { FilamentInfoDto } from './dto/filament-info.dto';

@Injectable()
export class FilamentInfoService {
  constructor(
    @InjectModel(The3dPrintFilamentInfo.name)
    private readonly filamentInfoModel: Model<The3dPrintFilamentInfo>,
  ) {}

  //   根据数组 新增或更新
  async createOrUpdate(filamentId: string, body: FilamentInfoDto[]) {
    const bodyWithFilament = body.map((item) => ({
      ...item,
      filament: filamentId,
    }));
    // 如果有id就更新，没有就新增
    const results = await Promise.all(
      bodyWithFilament.map(async (item) => {
        if (item._id) {
          return await this.filamentInfoModel.findByIdAndUpdate(
            item._id,
            item,
            { new: true },
          );
        } else {
          return await this.filamentInfoModel.create(item);
        }
      }),
    );

    const infos = await this.filamentInfoModel.find({ filament: filamentId });
    // 如果 body 里面没有的，就设置 isDelete 为 true
    const ids = infos.map((item) => item._id.toString());
    const deleteIds = ids.filter(
      (id) => !body.map((item) => item._id).includes(id),
    );
    await this.deleteByIds(deleteIds);

    return results;
  }

  //   批量标记为删除
  async deleteByIds(ids: string[]): Promise<any> {
    const results = await this.filamentInfoModel.updateMany(
      { _id: { $in: ids } },
      { isDelete: true },
    );

    return results;
  }
}
