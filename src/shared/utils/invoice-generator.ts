import { Invoice } from "../models/Invoice";
import { InvoiceNumberGenerator } from "./invoice-number-generator";

export interface InvoiceGeneratorPayload {
  dueDate: string;
  customerName: string;
  customerEmail: string;
  lineItems: Array<{
    itemName: string;
    quantity: number;
    unityPrice: number;
  }>;
}

export class InvoiceGenerator {
  public static generate(payload: InvoiceGeneratorPayload): Invoice {
    const { dueDate, customerName, customerEmail, lineItems } = payload;
    const now = new Date();
    const isoDateString = now.toISOString();
    const lines = [];
    let totalAmount = 0;

    for (const l of lineItems) {
      totalAmount += l.quantity * l.unityPrice;
      lines.push({
        ItemName: l.itemName,
        Quantity: l.quantity,
        UnityPrice: l.unityPrice,
      })
    }

    return {
      InvoiceNumber: InvoiceNumberGenerator.generateRandomInvoiceNumber(),
      InvoiceDate: isoDateString,
      InvoiceStatus: 'Unpaid',
      DueDate: dueDate,
      TotalAmount: totalAmount,
      CustomerName: customerName,
      CustomerEmail: customerEmail,
      LineItems: lines
    }
  }
}