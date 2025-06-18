import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:13001',
      'http://localhost:13000',
      'http://192.168.0.7:13000',
      /^http:\/\/192\.168\.0\.\d+:13000$/,
      'https://www.draksnksha.com',
      'http://www.draksnksha.com',
    ], // Frontend URLs
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Check if we're running seed command
  if (process.argv.includes('--seed')) {
    const seedService = app.get(SeedService);
    await seedService.seedAll();
    console.log('🌱 Database seeded successfully!');
    await app.close();
    return;
  }

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Psychology Website API')
    .setDescription('API for Dr. Akanksha Agarwal Psychology Website')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 13001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📄 API documentation: http://localhost:${port}/api`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
