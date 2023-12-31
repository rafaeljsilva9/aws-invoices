import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CreateInvoiceLambda } from './lambdas/create-invoices-lambda';
import { ApiGateway } from './gateway/api-gateway';
import { InvoicesUserPool } from './cognito/user-pool';
import { InvoicesUserPoolClient } from './cognito/user-pool-client';
import { SignUpLambda } from './lambdas/sign-up-lambda';
import { SignInLambda } from './lambdas/sign-in-lambda';
import { ConfirmEmailLambda } from './lambdas/confirm-email-lambda';
import { DynamoDB } from './dynamo/dynamo-db';
import { GetInvoicesLambda } from './lambdas/get-invoices-lambda';
import { LambdaLayer } from './lambda-layer/lambda-layer';
import { DeleteInvoiceLambda } from './lambdas/delete-invoice-lambda';
import { UpdateInvoiceLambda } from './lambdas/update-invoice-lambda';
import { SnsTopic } from './sns/sns-topic';
import { GetInvoiceLambda } from './lambdas/get-invoice-lambda';

export class AwsInvoicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    try {
      super(scope, id, props);
      DynamoDB.construct(this, 'Dynamo');
      LambdaLayer.construct(this, 'LambdaLayer');
      this.constructCognitoResourses();
      this.constructLambdas();
      new ApiGateway(this, 'ApiGateway');
    } catch(error) {
      console.log(error);
      throw error;
    }
  }

  private constructCognitoResourses(): void {
    InvoicesUserPool.construct(this, 'UserPool');
    InvoicesUserPoolClient.construct(this, 'UserPoolClient');
    SnsTopic.construct(this, "InvoicesSnsTopic");
  }

  private constructLambdas(): void {
    SignUpLambda.construct(this, 'SignUp');
    SignInLambda.construct(this, 'SignIn');
    ConfirmEmailLambda.construct(this, 'ConfirmEmail');
    CreateInvoiceLambda.construct(this, 'CreateInvoice');
    GetInvoicesLambda.construct(this, 'GetInvoices');
    GetInvoiceLambda.construct(this, 'GetInvoice');
    DeleteInvoiceLambda.construct(this, 'DeleteInvoices');
    UpdateInvoiceLambda.construct(this, 'UpdateInvoices');
  }
}
