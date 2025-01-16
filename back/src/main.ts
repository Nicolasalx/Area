import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.enableCors({
    origin: ['http://localhost:8081', 'http://frontend:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false,
  });

  app.use(json());

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('AREA BACKEND API')
      .setDescription('API for AREA project')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const paths = Object.values(document.paths);
    paths.forEach((path: any) => {
      Object.values(path).forEach((method: any) => {
        if (!method.security) {
          method.security = [{ 'JWT-auth': [] }];
        }
      });
    });

    SwaggerModule.setup('api', app, document);
  }

  console.log('Launching backend on port', process.env.PORT ?? 8080);
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
