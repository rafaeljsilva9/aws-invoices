export interface Invoice {
  InvoiceNumber: string;
  InvoiceDate: string;
  InvoiceStatus: string;
  DueDate: string;
  TotalAmount: number;
  CustomerName: string,
  CustomerEmail: string,
  LineItems: Array<{
    ItemName: string;
    Quantity: number;
    UnityPrice: number;
  }>;
}