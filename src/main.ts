import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  await app.listen(5151);
  Logger.info(`http://localhost:${5151}`, '服务启动成功');
}
bootstrap();
