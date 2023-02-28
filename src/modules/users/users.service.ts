import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/dtos/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('Users') private readonly usersModel: Model<any>) {}

  async create(body: LoginDto) {
    const { password, username, ...rest } = body;
    const user = await this.usersModel.findOne({ username });
    if (user) throw new BadRequestException('用户名已存在');

    // 生成盐值和加密后的密码
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.usersModel.create({ ...rest, password: hashedPassword, salt });

    return { message: '注册成功' };
  }

  // 验证用户密码
  async validateUser(username: string, password: string): Promise<any> {
    // 根据用户名查找用户
    const user = await this.usersModel.findOne({ username });
    if (!user) {
      return null;
    }
    // 比较密码是否匹配
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return null;
    }

    return user;
  }
}
