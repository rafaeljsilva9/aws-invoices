import * as cdk from "aws-cdk-lib";
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { DynamoDB } from "../dynamo/dynamo-db";
import { LambdaLayer } from "../lambda-layer/lambda-layer";
import { SnsTopic } from "../sns/sns-topic";

export class UpdateInvoiceLambda extends Construct {
  private static instance: UpdateInvoiceLambda;
  private lambda: Lambda.Function;

  private constructor(scope: Construct, id: string) {
    super(scope, id);
    this.createLambda();
  }

  public getLambda(): Lambda.Function {
    return this.lambda;
  }

  private createLambda() {
    this.lambda = new Lambda.Function(this, "Lambda", {
      runtime: Lambda.Runtime.NODEJS_16_X,
      code: Lambda.AssetCode.fromAsset("dist/src/functions/update-invoice"),
      handler: "index.handler",
      layers: [LambdaLayer.getInstance().getLayer()],
      timeout: cdk.Duration.seconds(5),
      environment: {
        DYNAMODB_TABLE_NAME: DynamoDB.getInstance().invoicesTable.tableName,
        SNS_TOPIC_ARN: SnsTopic.getInstance().getSnsTopic().topicArn,
      },
    });

    DynamoDB.getInstance().invoicesTable.grantReadData(this.lambda);

    this.lambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:Query', 'dynamodb:UpdateItem'],
        resources: [DynamoDB.getInstance().invoicesTable.tableArn],
      })
    );

    this.lambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['sns:Subscribe', 'sns:Publish'],
        resources: [SnsTopic.getInstance().getSnsTopic().topicArn],
      })
    );
  }

  public static construct(scope: Construct, id: string): void {
    if (!this.instance) {
      this.instance = new this(scope, id);
    } else {
      throw Error("Resource has already been created");
    }
  }

  public static getInstance(): UpdateInvoiceLambda {
    if (!this.instance) {
      throw Error("Resource has not yet been created");
    }

    return this.instance;
  }
}