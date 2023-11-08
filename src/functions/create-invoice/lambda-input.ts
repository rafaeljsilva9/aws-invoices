export interface LambdaInput {
  dueDate: string;
  customerName: string;
  lineItems: Array<{
    itemName: string;
    quantity: number;
    unityPrice: number;
  }>;
}