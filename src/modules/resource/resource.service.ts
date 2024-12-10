import { BadRequestException, Injectable } from '@nestjs/common';
import { QiniuService } from '../system/storage-service/qiniu/qiniu.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource } from 'src/modules/resource/schemas/resource';
import { ResourceAssociationName, ResourceName } from './schemas/ref-names';
import { CloudflareR2Service } from '../system/storage-service/cloudflare-r2/cloudflare-r2.service';
import { ConfigService } from '@nestjs/config';
import { PageDto } from 'src/public/dto/page';
import { Response } from 'src/utils/response';
import { ResourceAssociation } from './schemas/association';
import { MySiteBlogSchemaName } from '../my-site/blog/blog.schema';
import { BlogService } from '../my-site/blog/blog.service';

@Injectable()
export class ResourceService {
  constructor(
    private readonly qiniuService: QiniuService,
    private readonly r2Service: CloudflareR2Service,
    private readonly configService: ConfigService,
    @InjectModel(ResourceName) private readonly resourceModel: Model<Resource>,
    @InjectModel(ResourceAssociationName)
    private readonly associationModel: Model<ResourceAssociation>,
    private readonly blogservice: BlogService,
  ) {}

  async list(query: PageDto, service: string) {
    const { page = 1, pageSize = 10 } = query;

    const users = await this.resourceModel
      .find({ service })
      .populate('creator')
      .populate('updater')
      .sort({ createdAt: -1 }) // 按创建时间倒序
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await this.resourceModel.countDocuments({ service });

    return Response.page(users, { page, pageSize, total });
  }

  // 上传文件
  async uploadFile(dir: string, file: Express.Multer.File, user) {
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

    const dbResult = await this.resourceModel.create({
      ...result,
      creator: user,
    });

    return dbResult;
  }

  // 批量上传文件
  async uploadFiles(dir: string, files: Express.Multer.File[], user) {
    const results = await Promise.all(
      files.map((file) => this.uploadFile(dir, file, user)),
    );
    return results;
  }

  async getVisitUrlByDetail(detail: Resource) {
    const service = detail.service;

    let url: string | null = null;

    if (service === 'qiniu') {
      url = await this.qiniuService.getVisitUrl(detail.key);
    }

    if (service === 'r2') {
      url = await this.r2Service.getFileUrl(detail.key);
    }

    return url;
  }

  //   获取访问链接
  async getVisitUrl(id: string) {
    const result = await this.resourceModel.findById(id);

    if (!result) {
      throw new BadRequestException('资源不存在');
    }

    return this.getVisitUrlByDetail(result);
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
        url: await this.getVisitUrl(resource._id as string),
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

  // 关联数据和资源
  async associateDataAndResource({
    resourceIds,
    associatedDataId,
    associatedDataFrom,
  }: {
    resourceIds: string[];
    associatedDataId: string;
    associatedDataFrom: string;
  }) {
    const result = await this.associationModel.create(
      resourceIds.map((resourceId) => ({
        resourceId,
        associatedDataId,
        associatedDataFrom,
      })),
    );

    return result;
  }

  // 取消关联数据和资源
  async disassociateDataAndResource(
    resourceId: string,
    associatedDataId: string,
  ): Promise<any> {
    return await this.associationModel.deleteOne({
      resourceId,
      associatedDataId,
    });
  }

  async disassociateDataAndResourceByDataId(associatedDataId: string) {
    await this.resourceModel.updateMany(
      { associatedDataId },
      { $unset: { associatedDataId: 1, associatedDataFrom: 1 } },
    );
  }

  private async getServiceByName(modelName: string, id: string) {
    switch (modelName) {
      case MySiteBlogSchemaName:
        return await this.blogservice.getBlogDetail(id);
      default:
        throw new BadRequestException(`未知的模型名: ${modelName}`);
    }
  }

  // 获取关联数据
  async getAssociatedData(resourceId: string) {
    const associations = await this.associationModel.find({ resourceId });

    if (!associations.length) {
      return [];
    }

    // 动态填充关联数据
    const associatedData = await Promise.all(
      associations.map(async (association) => {
        const modelName = association.associatedDataFrom;
        const data = await this.getServiceByName(
          modelName,
          association.associatedDataId,
        );
        return {
          resourceId: association.resourceId,
          associatedDataId: association.associatedDataId,
          associatedDataFrom: association.associatedDataFrom,
          data,
        };
      }),
    );

    return associatedData;
  }

  // 获取资源详情和关联数据
  async getResourceDetail(id: string): Promise<any> {
    const resource = await this.resourceModel
      .findById(id)
      .populate('creator')
      .lean();

    if (!resource) {
      throw new BadRequestException('资源不存在');
    }

    const associatedData = await this.getAssociatedData(id);

    return {
      ...resource,
      url: await this.getVisitUrlByDetail(resource as Resource),
      associatedData,
    };
  }

  async getResourceByKey(key: string): Promise<Resource | null> {
    return this.resourceModel.findOne({ key });
  }
}
