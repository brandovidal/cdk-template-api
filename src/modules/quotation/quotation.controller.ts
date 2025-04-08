import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { QuotationService } from './quotation.service';

import { CreateQuotationRequestDto, UpdateQuotationRequestDto } from './dto/quotation-request.dto';
import { Quotation } from './entities/quotation.dto';

@Controller('quotations')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Get()
  async getAllQuotations(): Promise<Quotation[]> {
    return this.quotationService.findAll();
  }

  @Get(':id')
  async getQuotationById(@Param('id') id: string): Promise<Quotation | null> {
    return this.quotationService.findById(id);
  }

  @Post()
  async createQuotation(@Body() quotationData: CreateQuotationRequestDto): Promise<Quotation> {
    return this.quotationService.create(quotationData);
  }

  @Patch(':id')
  async updateQuotation(
    @Param('id') id: string,
    @Body() updateData: UpdateQuotationRequestDto,
  ): Promise<Quotation | null> {
    return this.quotationService.update(id, updateData);
  }
}
