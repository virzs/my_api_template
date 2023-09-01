import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageDto } from 'src/dtos/page';
import { Response } from 'src/utils/response';

@Injectable()
export class UsersService {
  constructor(@InjectModel('Users') private readonly usersModel: Model<any>) {}

  async getNormalUser(query: PageDto) {
    const { page = 1, pageSize = 10 } = query;

    const users = await this.usersModel
      .find({ type: 0 }, { password: 0, salt: 0 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('roles')
      .exec();

    const total = await this.usersModel.countDocuments({ type: 0 });

    return Response.page(users, { page, pageSize, total });
  }
}
