# 日志系统

- /src/config/log4.ts
- /src/public/filter/all.ts
- /src/public/filter/http.ts
- /src/public/interceptor/transform.ts
- /src/public/middleware/log.ts
- /src/public/template/log.ts
- /src/utils/log4.ts

`/src/main.ts`

``` ts
import { AllExceptionsFilter } from './public/filter/all';
import { HttpExceptionFilter } from './public/filter/http';
import { TransformInterceptor } from './public/interceptor/transform';
import { logger } from './public/middleware/log';
import { Logger } from './utils/log4';

...
...

// request 日志
  app.use(logger);

  //全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 过滤处理 HTTP 异常
  app.useGlobalFilters(new HttpExceptionFilter());

  //过滤其他类型异常
  app.useGlobalFilters(new AllExceptionsFilter());

...
...
```
