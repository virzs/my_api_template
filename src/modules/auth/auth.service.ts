import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { Cache } from 'cache-manager';
import { jwtConfig } from 'src/config/jwt';
import { v4 as uuidV4 } from 'uuid';
import { RedisConstants } from 'src/common/constants/redis';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<any>,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // 验证用户密码
  async validateUser(email: string, password: string): Promise<any> {
    // 根据邮箱查找用户
    const user = await this.usersModel.findOne({ email }, { salt: 0 }).lean();
    if (!user) {
      throw new BadRequestException('邮箱或密码错误');
    }

    const { password: userPassword, ...rest } = user;

    // 比较密码是否匹配
    const match = await bcrypt.compare(password, userPassword);
    if (!match) {
      throw new BadRequestException('邮箱或密码错误');
    }

    return rest;
  }

  async register(body: RegisterDto) {
    const { password, email, captcha, ...rest } = body;

    const cacheCaptcha: any = await this.cacheManager.get(
      `${RedisConstants.EMAIL_REGISTER_CAPTCHA_KEY}:${email}`,
    );
    if (!cacheCaptcha) throw new BadRequestException('验证码错误');

    if (cacheCaptcha.captcha !== captcha.toString())
      throw new BadRequestException('验证码错误');

    const user = await this.usersModel.findOne({ email });
    if (user) throw new BadRequestException('邮箱已存在');

    // 生成盐值和加密后的密码
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.usersModel.create({
      ...rest,
      password: hashedPassword,
      salt,
      email,
    });

    return { message: '注册成功' };
  }

  async login(body: LoginDto) {
    const { password, email } = body;
    const user = await this.validateUser(email, password);

    const uuid = uuidV4();

    const access_token = this.jwtService.sign({ user, uuid });

    const refresh_token = this.refreshTokenService.createRefreshToken(user);

    if (!user) {
      throw new BadRequestException('邮箱或密码错误');
    }

    const ttl = this.refreshTokenService.getTTL();

    // 获取当前用户所有的refreshToken
    const cache: string[] = await this.cacheManager.get(
      `${RedisConstants.AUTH_REFRESH_TOKEN_KEY}:${user._id.toString()}`,
    );

    // 将新的refreshToken存入缓存，并限制最大设备数
    this.cacheManager.set(
      `${RedisConstants.AUTH_REFRESH_TOKEN_KEY}:${user._id.toString()}`,
      [...(cache ? cache : []), { refresh_token, uuid }].slice(
        -jwtConfig.refreshToken.maxDevices,
      ),
      ttl,
    );

    return {
      ...user,
      access_token,
      refresh_token,
    };
  }

  async refreshToken(body: RefreshTokenDto) {
    const { refreshToken: postRefreshToken } = body;

    const decoded = await this.jwtService.verifyAsync(postRefreshToken);

    const cache: any[] = await this.cacheManager.get(
      `${RedisConstants.AUTH_REFRESH_TOKEN_KEY}:${decoded.user._id.toString()}`,
    );

    if (!cache) {
      throw new UnauthorizedException('登录已过期');
    }

    const refreshToken = cache.find((item) => item.uuid === decoded.uuid);

    if (!refreshToken) {
      throw new UnauthorizedException('登录已过期');
    }

    const isExpired = await this.refreshTokenService.isRefreshTokenExpired(
      refreshToken.refresh_token,
    );

    const isExpiresSoon =
      await this.refreshTokenService.isRefreshTokenExpiresSoon(
        refreshToken.refresh_token,
      );

    if (isExpired) {
      throw new UnauthorizedException('登录已过期');
    }

    const newUUid = uuidV4();

    const newAccessToken = this.jwtService.sign({
      user: decoded.user,
      uuid: newUUid,
    });

    const newTTL = this.refreshTokenService.getTTL();

    const newRefreshToken = this.refreshTokenService.createRefreshToken(
      decoded.user,
    );

    this.cacheManager.set(
      `${RedisConstants.AUTH_REFRESH_TOKEN_KEY}:${decoded.user._id.toString()}`,
      cache.map((item) => {
        if (item.uuid === decoded.uuid) {
          item.uuid = newUUid;
        }
        if (isExpiresSoon) {
          item.refresh_token = newRefreshToken;
        }
        return item;
      }),
      newTTL,
    );

    return {
      access_token: newAccessToken,
      refresh_token: isExpiresSoon ? newRefreshToken : postRefreshToken,
    };
  }
}
