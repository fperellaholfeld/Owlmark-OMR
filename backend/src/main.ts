import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as bodyparser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // All routes will be prefixed with /api/v1
  app.setGlobalPrefix('api/v1');

  app.use(morgan('dev'));
  app.use(bodyparser.json({ limit: '150mb' }));
  app.use(bodyparser.urlencoded({ limit: '150mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
