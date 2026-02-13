import { NestFactory } from '@nestjs/core';
import { AxelsBatchModule } from './axels-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(AxelsBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
