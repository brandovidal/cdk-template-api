export interface Quotation {
  id: string;
  clientName: string;
  description: string;
  amount: number;
  currency: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
