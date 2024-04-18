import { NestFactory } from '@nestjs/core';
import { AuthModule } from './authentication/authentication.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  await app.listen(3000);
}
bootstrap();
