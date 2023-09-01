import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from 'src/schemas/permission';
import { Model } from 'mongoose';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async list() {
    return await this.permissionModel.find().lean();
  }

  async treeInfo() {
    const t = await this.permissionModel
      .aggregate([
        // {
        //   $graphLookup: {
        //     from: 'permission',
        //     startWith: '$_id',
        //     connectFromField: '_id',
        //     connectToField: 'parent',
        //     as: 'children',
        //     depthField: 'depth',
        //     maxDepth: 10, // 设置最大深度，避免无限递归
        //   },
        // },
        {
          $match: {
            parent: null,
          },
        },
        {
          $graphLookup: {
            from: 'permission',
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'children',
            as: 'children',
            restrictSearchWithMatch: { _id: 1 },
          },
        },
        {
          $lookup: {
            from: 'permission',
            localField: '_id',
            foreignField: 'parent',
            as: 'children',
          },
        },
        {
          $unwind: {
            path: '$children',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'permission',
            localField: 'children._id',
            foreignField: 'parent',
            as: 'children.children',
          },
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            description: { $first: '$description' },
            url: { $first: '$url' },
            method: { $first: '$method' },
            type: { $first: '$type' },
            level: { $first: '$level' },
            parent: { $first: '$parent' },
            children: { $push: '$children' },
          },
        },
      ])
      .exec();

    return t;
  }

  async create(body: CreatePermissionDto) {
    return await this.permissionModel.create(body);
  }

  async update(id: string, body: UpdatePermissionDto) {
    return await this.permissionModel.findByIdAndUpdate(id, body);
  }

  async deleteAll(id: string) {
    const children = await this.permissionModel.find({ parent: id });
    const el = await this.permissionModel.findByIdAndDelete(id);
    if (children && children.length > 0) {
      await this.permissionModel.deleteMany({ parent: id });
      for (const child of children) {
        this.deleteAll(child._id.toString());
      }
    }
    return el;
  }

  async delete(id: string) {
    return this.deleteAll(id);
  }
}
