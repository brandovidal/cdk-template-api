import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import * as dotenv from 'dotenv';
import { Construct } from 'constructs';

dotenv.config();

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Configurar credenciales de AWS
    const awsConfig = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    };

    // Crear Lambda function
    const quotationLambda = new lambda.Function(this, 'QuotationLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/lambda/quotation'),
      environment: {
        NODE_ENV: 'production',
        AWS_REGION: awsConfig.region || 'us-east-1',
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // Crear API Gateway
    const api = new apigateway.RestApi(this, 'QuotationApi', {
      restApiName: 'Quotation Service',
      description: 'API para el servicio de cotizaciones',
      deployOptions: {
        stageName: 'prod',
      },
    });

    // Crear recurso y métodos para quotations
    const quotations = api.root.addResource('quotations');
    quotations.addMethod('GET', new apigateway.LambdaIntegration(quotationLambda));
    quotations.addMethod('POST', new apigateway.LambdaIntegration(quotationLambda));

    // Crear recurso para quotation individual
    const quotation = quotations.addResource('{id}');
    quotation.addMethod('GET', new apigateway.LambdaIntegration(quotationLambda));
    quotation.addMethod('PUT', new apigateway.LambdaIntegration(quotationLambda));

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'URL de la API Gateway',
    });
  }
}
