import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dtos/user';
import { User } from 'src/schemas/user';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../../schemas/refreshToken';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<any>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenService: RefreshTokenService,
    private jwtService: JwtService,
  ) {}

  // 验证用户密码
  async validateUser(username: string, password: string): Promise<any> {
    // 根据用户名查找用户
    const user = await this.usersModel.findOne({ username });
    if (!user) {
      throw new BadRequestException('用户名或密码错误');
    }

    const { password: userPassword, ...rest } = user;

    // 比较密码是否匹配
    const match = await bcrypt.compare(password, userPassword);
    if (!match) {
      throw new BadRequestException('用户名或密码错误');
    }

    return rest;
  }

  async register(body: LoginDto) {
    const { password, username, ...rest } = body;
    const user = await this.usersModel.findOne({ username });
    if (user) throw new BadRequestException('用户名已存在');

    // 生成盐值和加密后的密码
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.usersModel.create({ ...rest, password: hashedPassword, salt });

    return { message: '注册成功' };
  }

  async login(body: LoginDto) {
    const { password, username } = body;
    const user = await this.validateUser(username, password);

    const access_token = await this.jwtService.sign(user);

    const refresh_token = await this.refreshTokenService.createRefreshToken(
      user,
    );

    return {
      ...user,
      access_token,
    };
  }
}
