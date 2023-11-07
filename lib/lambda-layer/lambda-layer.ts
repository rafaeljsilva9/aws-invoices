import * as Lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class LambdaLayer extends Construct {
  private static instance: LambdaLayer;
  private layer: Lambda.LayerVersion;

  private constructor(scope: Construct, id: string) {
    super(scope, id);
    this.layer = new Lambda.LayerVersion(this, "InvoicesLambdaLayer", {
      code: Lambda.AssetCode.fromAsset("dist/aws/layer"),
      compatibleRuntimes: [Lambda.Runtime.NODEJS_16_X],
    });
  }

  public getLayer(): Lambda.LayerVersion {
    return this.layer;
  }

  public static construct(scope: Construct, id: string): void {
    if (!this.instance) {
      this.instance = new this(scope, id);
    } else {
      throw Error("Resource has already been created");
    }
  }

  public static getInstance(): LambdaLayer {
    if (!this.instance) {
      throw Error("Resource has not yet been created");
    }

    return this.instance;
  }
}
