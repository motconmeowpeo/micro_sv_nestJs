import { NestFactory } from '@nestjs/core';
import { ApiMessageModule } from './api-message.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const API_MESSAGE = `api/v1/message`;
  const PORT = 17002;

  const app = await NestFactory.create(ApiMessageModule);
  await app.useGlobalGuards().useGlobalPipes().useGlobalInterceptors();
  await app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      port: 6379,
    },
  });

  await app.startAllMicroservices();

  await app.listen(PORT, () => {
    Logger.log(`Listening MESSAGE localhost:${PORT}/${API_MESSAGE}`);
  });
}
bootstrap();
