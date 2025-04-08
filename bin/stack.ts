import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { Construct } from 'constructs';

interface ApiLambdaStackProps extends cdk.StackProps {
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: ApiLambdaStackProps) {
    super(scope, id, props);

    // Crear Lambda function
    const quotationLambda = new lambda.Function(this, 'QuotationLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'bundle.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda-package.zip')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      architecture: lambda.Architecture.ARM_64,
      environment: {
        NODE_ENV: 'production'
      }
    });

    // Crear API Gateway
    const api = new apigateway.RestApi(this, 'QuotationApi', {
      restApiName: 'Quotation Service',
      description: 'API para el servicio de cotizaciones',
      deployOptions: {
        stageName: 'dev',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Integrar Lambda con API Gateway
    const lambdaIntegration = new apigateway.LambdaIntegration(quotationLambda, {
      proxy: true,
    });

    // Configurar rutas
    const quotations = api.root.addResource('quotations');
    quotations.addMethod('GET', lambdaIntegration);
    quotations.addMethod('POST', lambdaIntegration);

    const quotation = quotations.addResource('{id}');
    quotation.addMethod('GET', lambdaIntegration);
    quotation.addMethod('PUT', lambdaIntegration);

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'URL de la API Gateway',
    });
  }
}
