import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { jwtConfig } from 'src/config/jwt';
import { RefreshToken, RefreshTokenDocument } from 'src/schemas/refreshToken';
import { User } from 'src/schemas/user';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async createRefreshToken(user: User) {
    const refreshToken = new this.refreshTokenModel();
    refreshToken.user = user;
    refreshToken.expires = new Date(
      Date.now() + 1000 * jwtConfig.refreshToken.expiresIn,
    );
    await refreshToken.save();
    return this.jwtService.sign({ id: refreshToken.id });
  }

  async saveRefreshToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const tokenExists = await this.refreshTokenModel.findById(
          decoded['id'],
        );
        if (tokenExists) {
          return token;
        }
      }
      throw new UnauthorizedException();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async deleteRefreshToken(id: number) {
    return await this.refreshTokenModel.findByIdAndDelete(id);
  }

  async findRefreshTokenById(id: number) {
    return await this.refreshTokenModel.findById(id).populate('user');
  }

  async validateRefreshToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const tokenExists = await this.refreshTokenModel.findById(
          decoded['id'],
        );
        if (tokenExists && !this.isRefreshTokenExpired(tokenExists)) {
          return tokenExists.user;
        }
      }
      throw new UnauthorizedException();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async isRefreshTokenExpired(refreshToken: RefreshTokenDocument) {
    const currentDate = new Date();
    const refreshTokenExpiration = new Date(refreshToken.expires);
    return refreshTokenExpiration < currentDate;
  }
}
