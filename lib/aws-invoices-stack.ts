import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CreateInvoicesLambda } from './lambdas/create-invoices-lambda';
import { ApiGateway } from './gateway/api-gateway';

export class AwsInvoicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    try {
      super(scope, id, props);
      CreateInvoicesLambda.construct(this, 'CreateInvoices');
      new ApiGateway(this, 'ApiGateway');
    } catch(error) {
      console.log(error);
      throw error;
    }
  }
}
