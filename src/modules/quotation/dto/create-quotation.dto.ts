export class CreateQuotationDto {
  readonly customerName: string;
  readonly productName: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly description?: string;
}
