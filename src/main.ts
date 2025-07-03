import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Environment variables
  const apiPrefix = configService.get('API_PREFIX') ?? 'api/v1';
  const port = configService.get('PORT') ?? 3000;
  const swaggerPrefix = `${apiPrefix}/${configService.get('SWAGGER_PREFIX') ?? 'docs'}`;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('api/v1');
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Next Digital Technical Test')
    .setDescription('API for managing Next Digital Technical Test')
    .setVersion('1.0')
    .addTag('next-digital-technical-test')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPrefix, app, document);

  await app.listen(port);

  const appUrl = await app.getUrl();

  logger.debug(`Server is running on port ${appUrl}/${apiPrefix}`);
  logger.debug(`Swagger is running on port ${appUrl}/${swaggerPrefix}`);
}
bootstrap();
