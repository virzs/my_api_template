<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

个人后端接口模板

- Nestjs
- MongoDB
- Radis

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Build

```bash
$ pnpm run build
```

使用 `@vercel/ncc` 打包（打包文件会包含 `node_modules`，nestjs 默认打包不包含 `node_modules`）

如果项目包含了二进制文件，请使用对应的平台编译，ncc不会处理跨平台

如果需要 linux 版本，windows 平台可以安装 `wsl`，然后在 `wsl` 中执行

`ncc:build` 会重新下载依赖并打包

```bash
$ pnpm i -g @vercel/ncc
$ pnpm run ncc:build
```

## Docker

添加 `prod.env` 文件，按照 `.env.example` 文件填写，redis 配置如下

```env
redis_host='redis'
redis_port=6379
redis_password=''
redis_db=0
redis_ttl=60
```

mongo docker 配置按需求自行添加，或单独配置 mongo 地址

运行

```bash
docker-compose up
```

重新编译

```bash
docker-compose up --build
```

## cli

[NestJS Cli](https://docs.nestjs.com/cli/overview)

## 接口文档

WEB `/doc`
JSON `/doc-json`
YAML `/doc-yaml`

获取接口文档 json 文件

`main.ts` 下加入

```ts
const document = SwaggerModule.createDocument(app, config);

+fs.writeFileSync('./api-json.json', JSON.stringify(document));
```

## 环境变量

[ENV Doc](./docs//env.md)

## 创建 Modules

```bash
nest g res modules/xxx
```

## 常见问题

1. 启动报错，检查 redis 配置，`redis-cli shutdown` 关闭 redis 服务，`redis-server` 启动 redis 服务

```powershell
> Error: connect ECONNREFUSED ::1:6379
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1494:16)
```

```powershell
> redis-cli shutdown
> redis-server
```

2. 查询中间件

```ts
import { baseSchemaPreFind } from 'src/public/schema/base.schema';

xxxSchema.pre('find', baseSchemaPreFind);
```

3. 返回数据中不显示某些字段

```ts
import { baseSchemaToJSON } from 'src/public/schema/base.schema';

xxxSchema.methods.toJSON = baseSchemaToJSON;
```

## License

Nest is [MIT licensed](LICENSE).

- [日志](/docs/log.md) ✔️
- 注册 ✔️
- 登录 ✔️
- 权限 ✔️
- 七牛云对象存储 ✔️
- 邮件发送 ✔️
- 素材库

```

```
