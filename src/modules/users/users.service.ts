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
      .find({})
      .select('+type +status +enable')
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
      .findById(_id)
      .select('+roles +type')
      .populate({
        path: 'roles',
        populate: {
          path: 'permissions',
        },
      })
      .exec();

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
    const user = await this.usersModel.findById(id).select('+enable');

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    const result = await this.usersModel
      .findByIdAndUpdate(id, {
        enable: !user.enable,
      })
      .select('+enable');

    return result;
  }

  // 统计
  async statistics() {
    // 总用户数
    const total = await this.usersModel.countDocuments({ isDelete: false });
    // 未验证邮箱的用户数
    const unverified = await this.usersModel.countDocuments({
      status: 0,
      isDelete: false,
    });
    // 已禁用的用户数
    const disabled = await this.usersModel.countDocuments({
      status: 2,
      isDelete: false,
    });
    // 今天注册成功的用户数
    const today = await this.usersModel.countDocuments({
      createdAt: {
        $lt: new Date(),
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
      status: 1,
      isDelete: false,
    });
    // 昨日注册成功的用户数
    const yesterday = await this.usersModel.countDocuments({
      createdAt: {
        $lt: new Date(new Date().setHours(0, 0, 0, 0)),
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
      status: 1,
      isDelete: false,
    });
    // 过去7天注册成功的用户数
    const today1 = new Date();

    const last7Days = await Promise.all(
      Array.from({ length: 7 }).map(async (_, index) => {
        const date = new Date(
          today1.getFullYear(),
          today1.getMonth(),
          today1.getDate() - index,
        );
        const count = await this.usersModel.countDocuments({
          isDelete: false,
          status: 1,
          createdAt: {
            $gte: date,
            $lt: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() + 1,
            ),
          },
        });

        return {
          date,
          count,
        };
      }),
    );

    return {
      total,
      unverified,
      disabled,
      today,
      yesterday,
      last7Days: (await Promise.all(last7Days)).sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
      }),
    };
  }
}
