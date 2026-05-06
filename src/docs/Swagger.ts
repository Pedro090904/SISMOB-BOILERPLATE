import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication, prefix: string): void {
  const config = new DocumentBuilder()
    .setTitle('SISMOB-BOILERPLATE')
    .setDescription(
      'Padrão de desenvolvimento de sistemas backend no ecossistema SISMOB.',
    )
    .setVersion('1.0')
    .addTag('Linhas')
    .addBearerAuth() // Habilita o botão "Authorize" para Token JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/docs`, app, document);
}
