import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';

@Controller('quotations')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  create(@Body() createQuotationDto: CreateQuotationDto) {
    return this.quotationService.create(createQuotationDto);
  }

  @Get()
  findAll() {
    return this.quotationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationService.findOne(id);
  }
}
