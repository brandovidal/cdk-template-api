import { Module } from '@nestjs/common';
import { QuotationController } from './quotation.controller';
import { QuotationService } from './quotation.service';
import { ValidationModule } from './validations/validation.module';

@Module({
  imports: [ValidationModule],
  controllers: [QuotationController],
  providers: [QuotationService],
})
export class QuotationModule {}
