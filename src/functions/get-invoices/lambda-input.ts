export interface LambdaInput {
  InvoiceNumber: string;
  InvoiceDate: string;
  DueDate: string;
  CustomerEmail: string;
  Status: string;
  TotalAmount: number;
  LineItems: Array<{
    ItemName: string;
    Quantity: number;
    UnityPrice: number;
  }>;
}