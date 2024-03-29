import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageDto } from 'src/public/dto/page';
import { Response } from 'src/utils/response';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPassowrdDto } from './dto/reset-password.dto';
import { UsersName } from './schemas/ref-names';
import { User } from './schemas/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersName) private readonly usersModel: Model<User>,
  ) {}

  async getNormalUser(query: PageDto) {
    const { page = 1, pageSize = 10 } = query;

    const users = await this.usersModel
      .find({}, { password: 0, salt: 0 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('roles')
      .exec();

    const total = await this.usersModel.countDocuments({});

    return Response.page(users, { page, pageSize, total });
  }

  async create(body: CreateUserDto) {
    const result = await this.usersModel.create(body);
    return result;
  }

  async detail(id: string) {
    const result = await this.usersModel.findById(id).populate({
      path: 'roles',
      populate: {
        path: 'permissions',
      },
    });
    return result;
  }

  async update(id: string, body: UpdateUserDto) {
    const result = await this.usersModel.findByIdAndUpdate(id, body);
    return result;
  }

  async delete(id: string) {
    const result = await this.usersModel.findByIdAndDelete(id);
    return result;
  }

  async resetPassword(body: ResetPassowrdDto) {
    const { email, captcha, password } = body;

    const user = await this.usersModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('邮箱不存在');
    }
  }

  async getPermissions(user) {
    const { _id } = user;

    const result = await this.usersModel
      .findById(_id, { password: 0, salt: 0 })
      .populate({
        path: 'roles',
        populate: {
          path: 'permissions',
        },
      })
      .lean();

    if (result.type === 0) {
      return true;
    }

    const permissions = result.roles
      .map((i) => i.permissions)
      .flat()
      .filter((item, index, self) => {
        return index === self.findIndex((t) => t._id === item._id);
      });

    return permissions;
  }

  async findByEmail(email: string) {
    const result = await this.usersModel.findOne({ email });
    return result;
  }

  // 启用或禁用账号 enable
  async changeEnable(id: string) {
    const user = await this.usersModel.findById(id);

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    const result = await this.usersModel.findByIdAndUpdate(id, {
      enable: !user.enable,
    });

    return result;
  }
}
