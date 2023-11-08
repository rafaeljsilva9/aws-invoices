import { DocumentClient, ExpressionAttributeNameMap, ExpressionAttributeValueMap } from "aws-sdk/clients/dynamodb";
import { Invoice } from "../models/Invoice";

export class InvoicesService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) { }

  async getInvoices({ customerEmail, status }: { customerEmail: string, status: string }): Promise<Invoice[]> {
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

  async getInvoice(invoiceNumber: string): Promise<Invoice> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { invoiceNumber },
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

  // async updateInvoice(invoiceId: string, partialPost: Partial<Invoice>): Promise<Invoice> {
  //   const updated = await this.docClient
  //     .update({
  //       TableName: this.tableName,
  //       Key: { postId: invoiceId },
  //       UpdateExpression:
  //         "set #title = :title, description = :description, active = :active",
  //       ExpressionAttributeNames: {
  //         "#title": "title",
  //       },
  //       ExpressionAttributeValues: {
  //         ":title": partialPost.title,
  //         ":description": partialPost.description,
  //         ":active": partialPost.active,
  //       },
  //       ReturnValues: "ALL_NEW",
  //     })
  //     .promise();

  //   return updated.Attributes as Invoice;
  // }

  async deleteInvoice(invoiceId: string) {
    return this.docClient
      .delete({
        TableName: this.tableName,
        Key: { postId: invoiceId },
      })
      .promise();
  }
}
