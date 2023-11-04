import * as cdk from "aws-cdk-lib";
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { InvoicesUserPoolClient } from "../cognito/user-pool-client";
import { InvoicesUserPool } from "../cognito/user-pool";

export class SignUpLambda extends Construct {
  private static instance: SignUpLambda;
  public lambda: Lambda.Function;

  private constructor(scope: Construct, id: string) {
    super(scope, id);
    this.createLambda();
  }

  private createLambda() {
    this.lambda = new Lambda.Function(this, "Lambda", {
      runtime: Lambda.Runtime.NODEJS_16_X,
      code: Lambda.AssetCode.fromAsset("dist/src/functions/sign-up"),
      handler: "index.handler",
      timeout: cdk.Duration.seconds(5),
      environment: {
        USER_POOL_CLIENT_ID: InvoicesUserPoolClient.getUserPoolClient().userPoolClientId,
      },
    });

    this.lambda.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        actions: ['cognito-idp:SignUp'],
        resources: [InvoicesUserPool.getUserPool().userPoolArn],
      }),
    );
  }

  public static construct(scope: Construct, id: string): void {
    if (!this.instance) {
      this.instance = new this(scope, id);
    } else {
      throw Error("Resource has already been created");
    }
  }

  public static getInstance(): SignUpLambda {
    if (!this.instance) {
      throw Error("Resource has not yet been created");
    }

    return this.instance;
  }
}
