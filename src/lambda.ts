import { Handler, Context } from 'aws-lambda';
import { app } from './main';
import { proxy } from 'aws-serverless-express';

let server;

async function bootstrap() {
  if (!server) {
    const nestApp = await app;
    server = proxy(nestApp.getHttpAdapter().getInstance());
  }
  return server;
}

export const handler: Handler = async (event: any, context: Context) => {
  const server = await bootstrap();
  return server(event, context);
};
