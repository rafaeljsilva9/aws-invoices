import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { CreateInvoicesLambda } from '../lambdas/create-invoices-lambda';

export class ApiGateway extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const resourcePolicy = this.createResourcePolicy();
    const logGroup = new logs.LogGroup(this, "LogGroup");

    const api = new apigateway.RestApi(this, "api", {
      restApiName: "Invoices API Service",
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      policy: resourcePolicy,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields()
      },
      cloudWatchRole: true
    });

    const invoicesRootResource = api.root.addResource("invoices");
    this.createInvoicesMethod(invoicesRootResource);
    this.exportFixedOutputs(api);
  }

  private createResourcePolicy() {
    return new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          principals: [new iam.AnyPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: ["execute-api:/*/*/*"],
        })
      ]
    });
  }

  private createInvoicesMethod(resource: apigateway.Resource) {
    const lambdaIntegration = new apigateway.LambdaIntegration(
      CreateInvoicesLambda.getInstance().lambda, { proxy: true }
    );

    resource.addMethod("POST", lambdaIntegration, {
      methodResponses: [{ statusCode: "200" }],
    });
  }

  private exportFixedOutputs(api: apigateway.RestApi) {

    new cdk.CfnOutput(this, `api-url`, { value: api.url });
  }
}
