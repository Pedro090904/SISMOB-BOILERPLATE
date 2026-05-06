import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './docs/Swagger';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prefix = process.env.APP_PREFIX || 'api';
  app.setGlobalPrefix(prefix);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  app.enableCors();

  setupSwagger(app, prefix);

  const port = (8097);
  await app.listen(port);

  console.log(`\n🚀  CDP rodando em: http://localhost:${port}/${prefix}`);
  console.log(`📖  Swagger docs:   http://localhost:${port}/${prefix}/docs\n`);
}
bootstrap();
