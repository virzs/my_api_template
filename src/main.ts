import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import DefaultDTOValidationPipe from './public/pipe/dtoValid';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 接口文档
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  // 全局默认参数验证
  app.useGlobalPipes(new DefaultDTOValidationPipe());

  await app.listen(5151);
}
bootstrap();
