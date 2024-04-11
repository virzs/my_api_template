export const jwtConfig = {
  accessToken: {
    secret: 'xxxx',
    expiresIn: '10min',
  },
  refreshToken: {
    expiresIn: '7 days',
    maxDevices: 3, // 最大设备数
  },
};
