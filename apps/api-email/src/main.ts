import { NestFactory } from '@nestjs/core';
import { ApiEmailModule } from './api-email.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const API_EMAIL = `api/v1`;
  const PORT = 17001;
  const app = await NestFactory.create(ApiEmailModule);
  await app.useGlobalGuards().useGlobalPipes().useGlobalInterceptors();
  await app.setGlobalPrefix(API_EMAIL).connectMicroservice({
    transport: Transport.REDIS,
    options: {
      port: 6379,
    },
  });

  await app.startAllMicroservices();

  await app.listen(PORT, () => {
    Logger.log(`Listening EMAIL SERVICE localhost:${PORT}/${API_EMAIL}`);
  });
}
bootstrap();
