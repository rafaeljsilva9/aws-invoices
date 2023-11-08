import { Invoice } from "../models/Invoice";

export class InvoiceDto {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceStatus: string;
  dueDate: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  lineItems: Array<{
    itemName: string;
    quantity: number;
    unityPrice: number;
  }>;

  public static fromObject(invoice: Invoice): InvoiceDto {
    const lineItems = [];

    for (const l of invoice.LineItems) {
      lineItems.push({
        itemName: l.ItemName,
        quantity: l.Quantity,
        unityPrice: l.UnityPrice,
      })
    }

    return {
      invoiceNumber: invoice.InvoiceNumber,
      invoiceDate: invoice.InvoiceDate,
      invoiceStatus: invoice.InvoiceStatus,
      dueDate: invoice.DueDate,
      totalAmount: invoice.TotalAmount,
      customerName: invoice.CustomerName,
      customerEmail: invoice.CustomerEmail,
      lineItems
    }
  }

  public static fromArray(invoices: Invoice[]): InvoiceDto[] {
    return invoices.map((invoice) => this.fromObject(invoice));
  }
}