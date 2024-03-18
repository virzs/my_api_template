import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageDto } from 'src/public/dto/page';
import { Role } from 'src/modules/system/role/schemas/role';
import { CreateRoleDto } from './dto/create-role.dto';
import { Response } from 'src/utils/response';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async page(query: PageDto) {
    const { page = 1, pageSize = 10 } = query;

    const roles = await this.roleModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('creator')
      .populate('updater')
      .populate('permissions')
      .exec();

    const total = await this.roleModel.countDocuments();

    return Response.page(roles, { page, pageSize, total });
  }

  async detail(id: string) {
    const role = await this.roleModel
      .findById(id)
      .populate('creator')
      .populate('updater')
      .populate('permissions');
    return role;
  }

  async detailPermissions(id: string) {
    const role = await this.roleModel.findById(id);
    return role;
  }

  async create(body: CreateRoleDto, user: string) {
    const result = await this.roleModel.create({ ...body, creator: user });
    return result;
  }

  async update(id: string, body: CreateRoleDto, user: string) {
    const result = await this.roleModel.findByIdAndUpdate(id, {
      ...body,
      updater: user,
    });
    return result;
  }

  async delete(id: string) {
    const result = await this.roleModel.findByIdAndDelete(id);
    return result;
  }

  async list() {
    const roles = await this.roleModel.find();
    return roles;
  }
}
