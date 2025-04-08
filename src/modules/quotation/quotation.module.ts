import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuotationController } from './quotation.controller';
import { QuotationService } from './quotation.service';
import { DynamoDBService } from './dynamodb.service';

@Module({
  imports: [ConfigModule],
  controllers: [QuotationController],
  providers: [QuotationService, DynamoDBService],
})
export class QuotationModule {}
