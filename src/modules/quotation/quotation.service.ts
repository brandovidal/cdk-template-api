import { Injectable } from "@nestjs/common";

import { CreateQuotationRequestDto, UpdateQuotationRequestDto } from "./dto/quotation-request.dto";
import { Quotation } from "./entities/quotation.dto";

@Injectable()
export class QuotationService {
  private quotations: Quotation[] = [];

  async findAll(): Promise<Quotation[]> {
    return this.quotations;
  }

  async create(quotationData: CreateQuotationRequestDto): Promise<Quotation> {
    const newQuotation: Quotation = {
      id: Date.now().toString(),
      ...quotationData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.quotations.push(newQuotation);
    return newQuotation;
  }

  async update(
    id: string,
    updateData: UpdateQuotationRequestDto
  ): Promise<Quotation | null> {
    const index = this.quotations.findIndex((q) => q.id === id);
    if (index === -1) return null;

    const updatedQuotation = {
      ...this.quotations[index],
      ...updateData,
      updatedAt: new Date(),
    };
    this.quotations[index] = updatedQuotation;
    return updatedQuotation;
  }

  async findById(id: string): Promise<Quotation | null> {
    return this.quotations.find((q) => q.id === id) || null;
  }
}
