import { NestFactory, Reflector } from '@nestjs/core';
import { ApiAuthModule } from './api-auth.module';
import {
  MicroserviceOptions,
  TcpOptions,
  Transport,
} from '@nestjs/microservices';
import { INestApplication, INestMicroservice, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../../../libs/core/guards/jwt-auth.guard';

async function bootstrap() {
  const API_AUTH = `api/v1`;
  const PORT = 17000;
  const app = await NestFactory.create(ApiAuthModule);
  await app
    .useGlobalGuards(new JwtAuthGuard(app.get(Reflector)))
    .useGlobalPipes()
    .useGlobalInterceptors();
  app.setGlobalPrefix(API_AUTH).connectMicroservice({
    transport: Transport.REDIS,
    options: {
      port: 6379,
    },
  });

  await app.startAllMicroservices();

  await app.listen(PORT, () => {
    Logger.log(`Listening AUTH SERVICE localhost:${PORT}/${API_AUTH}`);
  });
}

bootstrap();
