import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import * as express from 'express';
import { configure } from '@codegenie/serverless-express';

import { AppModule } from '../app.module';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: any;

async function bootstrap(): Promise<any> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      {
        logger: ['error', 'warn'],
        bufferLogs: true,
      }
    );

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      })
    );

    nestApp.enableCors();

    await nestApp.init();
    cachedServer = configure({ app: expressApp });
  }

  return cachedServer;
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const server = await bootstrap();
  return server(event, context, 'PROMISE').promise;
};
