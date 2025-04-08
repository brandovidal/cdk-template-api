import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import * as dotenv from 'dotenv';
import { Construct } from 'constructs';

dotenv.config();

interface ApiStackProps extends cdk.StackProps {
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: ApiStackProps) {
    super(scope, id, props);

    // Configurar credenciales de AWS
    const awsConfig = {
      accessKeyId: props?.credentials?.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: props?.credentials?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: props?.credentials?.sessionToken,
      region: process.env.AWS_REGION || 'us-east-1',
    };

    // Crear Lambda function
    const quotationLambda = new lambda.Function(this, 'QuotationLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/lambda/quotation'),
      // environment: {
      //   NODE_ENV: 'production',
      //   AWS_REGION: awsConfig.region,
      //   AWS_ACCESS_KEY_ID: awsConfig.accessKeyId || '',
      //   AWS_SECRET_ACCESS_KEY: awsConfig.secretAccessKey || '',
      //   ...(awsConfig.sessionToken && { AWS_SESSION_TOKEN: awsConfig.sessionToken }),
      // },
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
