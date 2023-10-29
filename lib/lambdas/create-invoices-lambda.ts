import * as cdk from "aws-cdk-lib";
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class CreateInvoicesLambda extends Construct {
  private static instance: CreateInvoicesLambda;
  lambda: Lambda.Function;

  private constructor(scope: Construct, id: string) {
    super(scope, id);
    this.createLambda();
  }

  private createLambda() {
    this.lambda = new Lambda.Function(this, "Lambda", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      code: Lambda.AssetCode.fromAsset("dist/src/functions/create-invoices"),
      handler: "index.handler",
      timeout: cdk.Duration.seconds(5),
    });
  }

  public static construct(scope: Construct, id: string): void {
    if (!this.instance) {
      this.instance = new this(scope, id);
    } else {
      throw Error("Resource has already been created");
    }
  }

  public static getInstance(): CreateInvoicesLambda {
    if (!this.instance) {
      throw Error("Resource has not yet been created");
    }

    return this.instance;
  }
}
