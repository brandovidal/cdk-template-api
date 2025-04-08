export interface CreateQuotationRequestDto {
  clientName: string;
  description: string;
  amount: number;
  currency: string;
}

export interface UpdateQuotationRequestDto extends Partial<CreateQuotationRequestDto> {
  status?: "pending" | "approved" | "rejected";
}
