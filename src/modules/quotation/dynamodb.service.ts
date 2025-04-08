import { Injectable, OnModuleInit } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBService implements OnModuleInit {
  private readonly client: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new DynamoDBClient({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
    });
    this.docClient = DynamoDBDocumentClient.from(this.client);
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME', 'Quotations');
  }

  onModuleInit() {
    console.log(`DynamoDB Service initialized with table: ${this.tableName}`);
  }

  async putItem(item: Record<string, any>): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });

    await this.docClient.send(command);
  }

  async getItem(id: string): Promise<Record<string, any> | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });

    const result = await this.docClient.send(command);
    return result.Item || null;
  }

  async queryByClientName(clientName: string): Promise<Record<string, any>[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'ClientNameIndex',
      KeyConditionExpression: 'clientName = :clientName',
      ExpressionAttributeValues: {
        ':clientName': clientName,
      },
    });

    const result = await this.docClient.send(command);
    return result.Items || [];
  }

  async queryByStatus(status: string): Promise<Record<string, any>[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'StatusIndex',
      KeyConditionExpression: 'status = :status',
      ExpressionAttributeValues: {
        ':status': status,
      },
    });

    const result = await this.docClient.send(command);
    return result.Items || [];
  }

  async scanItems(): Promise<Record<string, any>[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const result = await this.docClient.send(command);
    return result.Items || [];
  }

  async updateItem(
    id: string,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>,
    expressionAttributeNames?: Record<string, string>,
  ): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
    });

    await this.docClient.send(command);
  }

  async deleteItem(id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { id },
    });

    await this.docClient.send(command);
  }
}
