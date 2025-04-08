export interface Quotation {
  id: string;
  clientName: string;
  description: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuotationDto {
  clientName: string;
  description: string;
  amount: number;
  currency: string;
}

export interface UpdateQuotationDto extends Partial<CreateQuotationDto> {
  status?: 'pending' | 'approved' | 'rejected';
}
