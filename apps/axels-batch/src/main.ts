import { NestFactory } from '@nestjs/core';
import { AxelsBatchModule } from './axels-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(AxelsBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
