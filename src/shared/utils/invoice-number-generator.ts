export class InvoiceNumberGenerator {
  private static MIN_INVOICE_NUMBER = 1;
  private static MAX_INVOICE_NUMBER = 100000;
  private static INVOICE_PREFIX = "INV-";

  private static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static generateRandomInvoiceNumber(): string {
    const randomNumber = this.generateRandomNumber(
      this.MIN_INVOICE_NUMBER,
      this.MAX_INVOICE_NUMBER
    );

    const formattedInvoiceNumber = `${this.INVOICE_PREFIX}${randomNumber.toString().padStart(6, '0')}`;

    return formattedInvoiceNumber;
  }
}