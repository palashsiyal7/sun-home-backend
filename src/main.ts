import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT
  const config = new DocumentBuilder()
    .setTitle('Education')
    .setDescription('Helium Education APIs')
    .setVersion('1.0')
    .addTag('edu')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Allow requests from frontend
  // app.use(cors());
  app.enableCors()
  await app.listen(port);
}
bootstrap();
