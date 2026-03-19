import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe - applies DTO validation to all endpoints
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,          // Strip unknown properties
    forbidNonWhitelisted: false, // Don't throw on extra props
    transform: true,          // Auto-transform types (string -> number etc)
    transformOptions: { enableImplicitConversion: true },
  }));

  // Mount all routes under /api to match nginx proxy_pass
  app.setGlobalPrefix('api');

  // CORS for development
  app.enableCors({
    origin: ['http://localhost', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
