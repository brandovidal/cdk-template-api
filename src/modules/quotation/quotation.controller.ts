import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto, UpdateQuotationDto, Quotation } from './quotation.types';

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
  async createQuotation(@Body() quotationData: CreateQuotationDto): Promise<Quotation> {
    return this.quotationService.create(quotationData);
  }

  @Put(':id')
  async updateQuotation(
    @Param('id') id: string,
    @Body() updateData: UpdateQuotationDto,
  ): Promise<Quotation | null> {
    return this.quotationService.update(id, updateData);
  }
}
