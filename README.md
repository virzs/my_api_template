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
- 登录
- 权限
- 七牛云对象存储

```

```
