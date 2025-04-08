import { Injectable } from '@nestjs/common';
import { Quotation, CreateQuotationDto, UpdateQuotationDto } from './quotation.types';
import { ValidationService } from './validations/validation.service';

@Injectable()
export class QuotationService {
  constructor(private readonly validationService: ValidationService) {}

  private quotations: Quotation[] = [];

  async findAll(): Promise<Quotation[]> {
    return this.quotations;
  }

  async create(quotationData: CreateQuotationDto): Promise<Quotation> {
    const validatedData = this.validationService.validateCreateQuotation(quotationData);

    const newQuotation: Quotation = {
      id: Date.now().toString(),
      ...validatedData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.quotations.push(newQuotation);
    return newQuotation;
  }

  async update(id: string, updateData: UpdateQuotationDto): Promise<Quotation | null> {
    // Validar los datos de actualización
    const validatedData = this.validationService.validateUpdateQuotation(updateData);

    const index = this.quotations.findIndex(q => q.id === id);
    if (index === -1) return null;

    const updatedQuotation = {
      ...this.quotations[index],
      ...validatedData,
      updatedAt: new Date(),
    };
    this.quotations[index] = updatedQuotation;
    return updatedQuotation;
  }

  async findById(id: string): Promise<Quotation | null> {
    return this.quotations.find(q => q.id === id) || null;
  }
}
