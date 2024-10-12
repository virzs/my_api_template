import { BadRequestException, Injectable } from '@nestjs/common';
import { QiniuService } from '../system/qiniu/qiniu.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource } from 'src/modules/resource/schemas/resource';
import { ResourceName } from './schemas/ref-names';
import { CloudflareR2Service } from '../system/cloudflare-r2/cloudflare-r2.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResourceService {
  constructor(
    private readonly qiniuService: QiniuService,
    private readonly r2Service: CloudflareR2Service,
    private readonly configService: ConfigService,
    @InjectModel(ResourceName) private readonly resourceModel: Model<Resource>,
  ) {}

  // 上传文件
  async uploadFile(dir: string, file: Express.Multer.File) {
    const config = this.configService.get('storage-service');

    let result: Partial<Resource> | null = null;

    if (config.service === 'qiniu') {
      result = await this.qiniuService.uploadFile(dir, file);
      result.key = `${dir}/${result.key}`;
      result.service = 'qiniu';
    }

    if (config.service === 'r2') {
      // 文件名+随机数字字母
      const fileName =
        file.originalname.split('.')[0] +
        '-' +
        Math.random().toString(36).slice(2);
      // 文件后缀名
      const ext = file.originalname.split('.').pop();

      const key = `${dir}/${fileName}.${ext}`;

      const r2Result = await this.r2Service.uploadFile(key, file);

      if (r2Result.$metadata.httpStatusCode === 200) {
        result = {
          name: `${fileName}.${ext}`,
          dir,
          key,
          size: file.size,
          mimetype: file.mimetype,
          service: 'r2',
        };
      } else {
        throw new BadRequestException('上传失败');
      }

      result.url = await this.r2Service.getFileUrl(key);
    }

    const dbResult = await this.resourceModel.create(result);

    return dbResult;
  }

  //   获取访问链接
  async getVisitUrl(id: string) {
    let url: string | null = null;

    const config = this.configService.get('storage-service');

    const result = await this.resourceModel.findById(id);

    if (!result) {
      throw new BadRequestException('资源不存在');
    }

    if (config.service === 'qiniu') {
      url = await this.qiniuService.getVisitUrl(result.key);
    }

    if (config.service === 'r2') {
      url = await this.r2Service.getFileUrl(result.key);
    }

    return url;
  }

  /**
   * @name 批量获取访问链接
   */
  async getVisitUrls(ids: string[]) {
    const resources = await this.resourceModel.find({ _id: { $in: ids } });

    if (!resources) {
      throw new BadRequestException('资源不存在');
    }

    const result = await Promise.all(
      resources.map(async (resource) => ({
        _id: resource._id,
        url: await this.getVisitUrl(resource._id),
      })),
    );

    return result;
  }

  // 根据 id 删除文件
  async deleteFile(id: string) {
    const config = this.configService.get('storage-service');

    const resource = await this.resourceModel.findById(id);

    if (!resource) {
      throw new BadRequestException('资源不存在');
    }

    if (config.service === 'qiniu') {
      const result = await this.qiniuService.deleteFile(resource.key);

      return result;
    }

    if (config.service === 'r2') {
      const result = await this.r2Service.deleteFile(resource.key);

      return result;
    }
  }
}
