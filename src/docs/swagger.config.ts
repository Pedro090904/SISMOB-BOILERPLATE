import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication, prefix: string): void {
  const config = new DocumentBuilder()
    .setTitle('CDP — Controle de Dados e Permissões')
    .setDescription(
      'API de gestão de acesso: usuários, grupos, módulos, sistemas e notificações do SISMOB.',
    )
    .setVersion('1.0')
    .addTag('Sistemas')
    .addTag('Módulos')
    .addTag('Serviços')
    .addTag('Tipos de Acesso')
    .addTag('Pessoas AD')
    .addTag('Preposto Empresas')
    .addTag('Usuários')
    .addTag('Grupos')
    .addTag('Grupos Usuários')
    .addTag('Grupo Módulos Acesso')
    .addTag('Sistemas Usuários')
    .addTag('Tipos de Notificações')
    .addTag('Notícias')
    .addTag('Notificações')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/docs`, app, document);
}
