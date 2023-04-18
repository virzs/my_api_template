export const jwtConfig = {
  accessToken: {
    secret: 'xxxx',
    expiresIn: '1h',
  },
  refreshToken: {
    expiresIn: '10days',
    maxDevices: 3, // 最大设备数
  },
};
