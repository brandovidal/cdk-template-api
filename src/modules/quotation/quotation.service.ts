import { Injectable } from "@nestjs/common";
import { CreateQuotationRequestDto, UpdateQuotationRequestDto } from "./dto/quotation-request.dto";
import { Quotation } from "./entities/quotation.dto";
import { DynamoDBService } from "./dynamodb.service";

@Injectable()
export class QuotationService {
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async findAll(): Promise<Quotation[]> {
    const items = await this.dynamoDBService.scanItems();
    return items as Quotation[];
  }

  async create(quotationData: CreateQuotationRequestDto): Promise<Quotation> {
    const newQuotation: Quotation = {
      id: Date.now().toString(),
      ...quotationData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.dynamoDBService.putItem(newQuotation);
    return newQuotation;
  }

  async update(
    id: string,
    updateData: UpdateQuotationRequestDto
  ): Promise<Quotation | null> {
    const existingQuotation = await this.findById(id);
    if (!existingQuotation) return null;

    const updatedQuotation = {
      ...existingQuotation,
      ...updateData,
      updatedAt: new Date(),
    };

    // Construir la expresión de actualización dinámicamente
    let updateExpression = 'SET updatedAt = :updatedAt';
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': updatedQuotation.updatedAt,
    };
    const expressionAttributeNames: Record<string, string> = {};

    // Agregar campos actualizados a la expresión
    Object.entries(updateData).forEach(([key, value]) => {
      if (key !== 'id') {
        updateExpression += `, #${key} = :${key}`;
        expressionAttributeValues[`:${key}`] = value;
        expressionAttributeNames[`#${key}`] = key;
      }
    });

    await this.dynamoDBService.updateItem(
      id,
      updateExpression,
      expressionAttributeValues,
      expressionAttributeNames
    );

    return updatedQuotation;
  }

  async findById(id: string): Promise<Quotation | null> {
    const item = await this.dynamoDBService.getItem(id);
    return item as Quotation || null;
  }

  async findByClientName(clientName: string): Promise<Quotation[]> {
    const items = await this.dynamoDBService.queryByClientName(clientName);
    return items as Quotation[];
  }

  async findByStatus(status: string): Promise<Quotation[]> {
    const items = await this.dynamoDBService.queryByStatus(status);
    return items as Quotation[];
  }

  async delete(id: string): Promise<boolean> {
    const existingQuotation = await this.findById(id);
    if (!existingQuotation) return false;

    await this.dynamoDBService.deleteItem(id);
    return true;
  }
}
