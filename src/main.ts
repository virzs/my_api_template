import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as os from 'os';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './public/filter/all';
import { HttpExceptionFilter } from './public/filter/http';
import { TransformInterceptor } from './public/interceptor/transform';
import { logger } from './public/middleware/log';
import DefaultDTOValidationPipe from './public/pipe/dtoValid';
import { Logger } from './utils/log4';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  // 接口文档
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  // 全局默认参数验证
  app.useGlobalPipes(new DefaultDTOValidationPipe());

  // request 日志
  app.use(logger);

  //全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 过滤处理 HTTP 异常
  app.useGlobalFilters(new HttpExceptionFilter());

  //过滤其他类型异常
  app.useGlobalFilters(new AllExceptionsFilter());

  // 设置允许跨域
  // https://tauri.localhost 是 tauri 项目的地址
  app.enableCors({
    origin: ['https://tauri.localhost'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, authorization',
  });

  const ifaces = os.networkInterfaces();
  let ip = '';
  for (const dev in ifaces) {
    ifaces[dev].forEach(function (details) {
      if (details.family === 'IPv4' && (dev === 'en0' || dev === 'WLAN')) {
        ip = details.address;
      }
    });
  }

  const port = process.env.PORT || 5151;

  await app.listen(port);

  Logger.info(`
  服务启动成功

  Local:   http://localhost:${port}
  Network: http://${ip}:${port}

  API 文档

  Local:   http://localhost:${port}/doc
  Network: http://${ip}:${port}/doc
  `);
}
bootstrap();
