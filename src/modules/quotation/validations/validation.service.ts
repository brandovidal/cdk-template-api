import { Injectable, BadRequestException } from '@nestjs/common';
import { createQuotationSchema, updateQuotationSchema } from './quotation.schema';
import { CreateQuotationDto, UpdateQuotationDto } from '../quotation.types';

@Injectable()
export class ValidationService {
  validateCreateQuotation(data: CreateQuotationDto): CreateQuotationDto {
    const { error, value } = createQuotationSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      throw new BadRequestException(`Error de validación: ${errorMessages}`);
    }

    return value;
  }

  validateUpdateQuotation(data: UpdateQuotationDto): UpdateQuotationDto {
    const { error, value } = updateQuotationSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      throw new BadRequestException(`Error de validación: ${errorMessages}`);
    }

    return value;
  }
}
