import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { Construct } from 'constructs';

interface DynamoDbStackProps extends cdk.StackProps {
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
}

export class DynamoDbStack extends cdk.Stack {
  public readonly quotationTable: dynamodb.Table;
  public readonly quotationLambda: lambda.Function;

  constructor(scope: Construct, id: string, props?: DynamoDbStackProps) {
    super(scope, id, props);

    // Crear tabla DynamoDB para cotizaciones
    this.quotationTable = new dynamodb.Table(this, 'QuotationTable', {
      tableName: 'Quotations',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Para desarrollo, en producción usar RETAIN
      timeToLiveAttribute: 'ttl',
    });

    // Agregar índices secundarios globales
    this.quotationTable.addGlobalSecondaryIndex({
      indexName: 'ClientNameIndex',
      partitionKey: { name: 'clientName', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
    });

    this.quotationTable.addGlobalSecondaryIndex({
      indexName: 'StatusIndex',
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
    });

    // Crear Lambda function
    this.quotationLambda = new lambda.Function(this, 'QuotationLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'bundle.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda-package.zip')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      architecture: lambda.Architecture.ARM_64,
      environment: {
        NODE_ENV: 'production',
        DYNAMODB_TABLE_NAME: this.quotationTable.tableName,
      },
    });

    // Dar permisos a Lambda para acceder a DynamoDB
    this.quotationTable.grantReadWriteData(this.quotationLambda);

    // Crear API Gateway
    const api = new apigateway.RestApi(this, 'QuotationApi', {
      restApiName: 'Quotation Service',
      description: 'API para el servicio de cotizaciones con DynamoDB',
      deployOptions: {
        stageName: 'dev',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Integrar Lambda con API Gateway
    const lambdaIntegration = new apigateway.LambdaIntegration(this.quotationLambda, {
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

    new cdk.CfnOutput(this, 'TableName', {
      value: this.quotationTable.tableName,
      description: 'Nombre de la tabla DynamoDB',
    });
  }
}
