import * as cdk from "aws-cdk-lib";
import { Construct } from 'constructs';
import { InvoicesUserPool } from "./user-pool";

export class InvoicesUserPoolClient extends Construct {
  private static instance: InvoicesUserPoolClient;
  private userPoolClient: cdk.aws_cognito.UserPoolClient;
  
  private constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = InvoicesUserPool.getUserPool();

    this.userPoolClient = new cdk.aws_cognito.UserPoolClient(this, 'InvoicesUserPoolClient', {
      userPool,
      authFlows: {
        userPassword: true,
      },
    });
  }

  public static construct(scope: Construct, id: string): void {
    if (!this.instance) {
      this.instance = new this(scope, id);
    } else {
      throw Error("Resource has already been created");
    }
  }

  public static getUserPoolClient(): cdk.aws_cognito.UserPoolClient {
    if (!this.instance) {
      throw Error("Resource has not yet been created");
    }

    return this.instance.userPoolClient;
  }
}
