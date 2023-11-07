import { aws_dynamodb } from "aws-cdk-lib";
import { Construct } from 'constructs';
import * as cdk from "aws-cdk-lib";

export class DynamoDB extends Construct {
  private static instance: DynamoDB;
  public invoicesTable: aws_dynamodb.Table;

  private constructor(scope: Construct, id: string) {
    super(scope, id);
    this.createTable();
  }

  private createTable() {
    this.invoicesTable = new aws_dynamodb.Table(this, 'InvoicesTable', {
      partitionKey: { name: 'InvoiceNumber', type: aws_dynamodb.AttributeType.STRING },
      sortKey: { name: 'CustomerEmail', type: aws_dynamodb.AttributeType.STRING },
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.invoicesTable.addGlobalSecondaryIndex({
      indexName: 'CustomerEmail',
      partitionKey: { name: 'CustomerEmail', type: aws_dynamodb.AttributeType.STRING },
      projectionType: aws_dynamodb.ProjectionType.ALL,
    });
  }

  public static construct(scope: Construct, id: string): void {
    if (!this.instance) {
      this.instance = new this(scope, id);
    } else {
      throw Error("Resource has already been created");
    }
  }

  public static getInstance(): DynamoDB {
    if (!this.instance) {
      throw Error("Resource has not yet been created");
    }

    return this.instance;
  }
}
