import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Daml Token API Documentation')
    .setDescription('API for managing tokens on Hedera ledger')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  if(process.env["identityImplementationAuthority_smart_contract_address"] === "0x01E21d7B8c39dc4C764c19b308Bd8b14B1ba139E") throw new Error("Please follow hardhat folder readme");
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
