import { aws_sns } from "aws-cdk-lib";
import { Construct } from 'constructs';

export class SnsTopic extends Construct {
  private static instance: SnsTopic;
  private snsTopic: aws_sns.Topic;

  private constructor(scope: Construct, id: string) {
    super(scope, id);
    this.snsTopic = new aws_sns.Topic(this, 'SNSTopic', {
      displayName: 'Invoices SNS Topic',
    });
  }

  public getSnsTopic(): aws_sns.Topic {
    return this.snsTopic
  }

  public static construct(scope: Construct, id: string): void {
    if (!this.instance) {
      this.instance = new this(scope, id);
    } else {
      throw Error("Resource has already been created");
    }
  }

  public static getInstance(): SnsTopic {
    if (!this.instance) {
      throw Error("Resource has not yet been created");
    }

    return this.instance;
  }
}
