import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt';
import * as ms from 'ms';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 创建refreshToken
   * @param user
   * @returns
   */
  createRefreshToken(user: any) {
    const token = this.jwtService.sign(user, {
      expiresIn: jwtConfig.refreshToken.expiresIn,
    });
    return token;
  }

  async isRefreshTokenExpired(refreshToken: any) {
    const currentDate = Math.floor(Date.now() / 1000);
    const decoded = await this.jwtService.verifyAsync(refreshToken);
    const refreshTokenExpiration = new Date(decoded.exp);

    return refreshTokenExpiration.getTime() < currentDate;
  }

  /**
   * 判断refreshToken是否即将过期
   * @param refreshToken
   * @returns
   */
  async isRefreshTokenExpiresSoon(refreshToken: string) {
    const currentDate = Math.floor(Date.now() / 1000);
    const decoded = await this.jwtService.verifyAsync(refreshToken);
    const refreshTokenExpiration = new Date(decoded.exp);
    const refreshTTL = this.getTTL();

    return refreshTokenExpiration.getTime() - currentDate < refreshTTL / 10;
  }

  getTTL() {
    return Math.floor(ms(jwtConfig.refreshToken.expiresIn));
  }
}
