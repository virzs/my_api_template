import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageDto } from 'src/dtos/page';
import { Response } from 'src/utils/response';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async create(body: CreateUserDto) {
    const result = await this.usersModel.create(body);
    return result;
  }

  async detail(id: string) {
    const result = await this.usersModel.findById(id).populate('roles');
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
}
