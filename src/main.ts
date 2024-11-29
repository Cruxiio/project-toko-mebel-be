import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Retrieve ConfigService instance
  const configService = app.get(ConfigService);

  // Use ConfigService to get environment variables
  const port = configService.get<number>('BE_PORT') || 3000;

  const fe_fullpath = configService.get<string>('FE_FULLPATH');

  // Menggunakan middleware cors
  app.use(
    cors({
      origin: fe_fullpath, // URL frontend yang diizinkan
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode HTTP yang diizinkan
      credentials: true, // Mengizinkan pengiriman cookie dan header melalui CORS
    }),
  );

  // Mengaktifkan global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Untuk mengubah data menjadi instance dari DTO
      whitelist: true, // Menghapus properti yang tidak didefinisikan di DTO
      enableDebugMessages: true, // Mengaktifkan pesan error
      // validationError: { value: true, target: true }, // Mengembalikan detail penyebab error jika DTO tidak valid
    }),
  );

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
