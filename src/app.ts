import * as cdk from 'aws-cdk-lib';
import { QuotationApiStack } from './stacks/quotation-api.stack';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();

new QuotationApiStack(app, `${process.env.PROJECT_NAME}-${process.env.STAGE}`, {
  env: {
    region: process.env.AWS_REGION || 'us-east-1',
  },
  description: 'Quotation API Stack with NestJS',
});
