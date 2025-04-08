import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import * as path from 'path';

export class QuotationApiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function for the NestJS application
    const nestLambda = new lambda.Function(this, 'QuotationApiLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dist/lambda.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../')),
      environment: {
        NODE_ENV: process.env.STAGE || 'dev',
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'QuotationApi', {
      restApiName: 'Quotation API',
      description: 'API for quotation management',
      deployOptions: {
        stageName: process.env.STAGE || 'dev',
      },
    });

    // Integrate Lambda with API Gateway
    const integration = new apigateway.LambdaIntegration(nestLambda, {
      requestTemplates: { 'application/json': '{ "statusCode": 200 }' },
    });

    // Add routes
    api.root.addMethod('ANY', integration);
    api.root.addProxy({
      defaultIntegration: integration,
      anyMethod: true,
    });
  }
}
