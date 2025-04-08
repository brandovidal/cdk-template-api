import { Injectable } from '@nestjs/common';
import { CreateQuotationDto } from './dto/create-quotation.dto';

@Injectable()
export class QuotationService {
  private readonly quotations: any[] = [];

  create(createQuotationDto: CreateQuotationDto) {
    const quotation = {
      id: Date.now().toString(),
      ...createQuotationDto,
      createdAt: new Date(),
    };
    this.quotations.push(quotation);
    return quotation;
  }

  findAll() {
    return this.quotations;
  }

  findOne(id: string) {
    return this.quotations.find(quotation => quotation.id === id);
  }
}
