import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. БРОНЕБІЙНИЙ CORS
  // Це каже браузеру: "Все ок, я дозволяю цьому сайту брати дані"
  app.enableCors({
    origin: true, // Дозволяє будь-який сайт (включаючи твій фронтенд)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Валідація даних
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // 3. Запуск (слухаємо 0.0.0.0 для хмари)
  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();