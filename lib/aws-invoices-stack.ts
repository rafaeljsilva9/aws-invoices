import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CreateInvoicesLambda } from './lambdas/create-invoices-lambda';
import { ApiGateway } from './gateway/api-gateway';
import { InvoicesUserPool } from './cognito/user-pool';
import { InvoicesUserPoolClient } from './cognito/user-pool-client';
import { SignUpLambda } from './lambdas/sign-up-lambda';
import { SignInLambda } from './lambdas/sign-in-lambda';
import { ConfirmEmailLambda } from './lambdas/confirm-email-lambda';

export class AwsInvoicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    try {
      super(scope, id, props);
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
  }

  private constructLambdas(): void {
    SignUpLambda.construct(this, 'SignUp');
    SignInLambda.construct(this, 'SignIn');
    ConfirmEmailLambda.construct(this, 'ConfirmEmail');
    CreateInvoicesLambda.construct(this, 'CreateInvoices');
  }
}
