import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface RouteUser {
  _id: string;
  username: string;
  email: string;
  status: number;
  type: number;
  roles: string[];
}

// 获取 请求中的 user 对象
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RouteUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
