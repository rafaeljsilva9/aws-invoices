import * as cdk from "aws-cdk-lib";
import { Construct } from 'constructs';

export class InvoicesUserPool extends Construct {
  private static instance: InvoicesUserPool;
  private userPool: cdk.aws_cognito.UserPool;
  
  private constructor(scope: Construct, id: string) {
    super(scope, id);
    this.userPool = new cdk.aws_cognito.UserPool(this, 'InvoicesUserPool', {
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
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

  public static getUserPool(): cdk.aws_cognito.UserPool {
    if (!this.instance) {
      throw Error("Resource has not yet been created");
    }

    return this.instance.userPool;
  }
}
