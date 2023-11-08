import { DocumentClient, ExpressionAttributeNameMap, ExpressionAttributeValueMap } from "aws-sdk/clients/dynamodb";
import { Invoice } from "../models/Invoice";

export class InvoicesService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) { }

  async getInvoices({ customerEmail, status }: { customerEmail: string, status?: string }): Promise<Invoice[]> {
    const attributeNames: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap = {
      '#CustomerEmail': 'CustomerEmail'
    };
    const attributeValues: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap = {
      ':email': customerEmail,
    };

    let filterExpression = undefined;

    if (status) {
      filterExpression = '#Status = :status';
      attributeNames['#Status'] = 'Status';
      attributeValues[':status'] = status;
    }

    const params = {
      TableName: this.tableName,
      IndexName: 'CustomerEmail',
      KeyConditionExpression: '#CustomerEmail = :email',
      FilterExpression: filterExpression,
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: attributeValues,
    };

    const queryResult = await this.docClient.query(params).promise();
    return queryResult.Items as Invoice[];
  }

  async getAllInvoices(): Promise<Invoice[]> {
    const result = await this.docClient
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return result.Items as Invoice[];
  }

  async getInvoice({ invoiceNumber, customerEmail }: { invoiceNumber: string, customerEmail?: string }): Promise<Invoice> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { InvoiceNumber: invoiceNumber },
      })
      .promise();

    return result.Item as Invoice;
  }

  async createInvoice(invoice: Invoice): Promise<Invoice> {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: invoice,
      })
      .promise();

    return invoice;
  }

  async updateInvoice(invoiceNumber: string, invoice: { status: string }): Promise<Invoice> {
    const { status } = invoice;
    const updated = await this.docClient
      .update({
        TableName: this.tableName,
        Key: {
          InvoiceNumber: invoiceNumber,
        },
        UpdateExpression:
          "set #Status = :status",
        ExpressionAttributeNames: {
          '#Status': 'Status'
        },
        ExpressionAttributeValues: {
          ":status": status,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return updated.Attributes as Invoice;
  }

  async deleteInvoice(invoiceNumber: string): Promise<void> {
    await this.docClient
      .delete({
        TableName: this.tableName,
        Key: {
          InvoiceNumber: invoiceNumber,
        },
      })
      .promise();
  }
}
