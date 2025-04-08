import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import * as express from 'express';
import { configure } from '@codegenie/serverless-express';

import { AppModule } from '../app.module';

let cachedServer: any;

async function bootstrap(): Promise<any> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

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
