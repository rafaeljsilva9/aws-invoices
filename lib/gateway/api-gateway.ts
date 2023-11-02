import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { CreateInvoicesLambda } from '../lambdas/create-invoices-lambda';
import { SignUpLambda } from "../lambdas/sign-up-lambda";
import { InvoicesUserPool } from "../cognito/user-pool";
import { SignInLambda } from "../lambdas/sign-in-lambda";
import { ConfirmEmailLambda } from "../lambdas/confirm-email-lambda";

export class ApiGateway extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const resourcePolicy = this.createResourcePolicy();
    const logGroup = new logs.LogGroup(this, "LogGroup");

    const api = new apigateway.RestApi(this, "RestApi", {
      restApiName: "Invoices API Service",
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      policy: resourcePolicy,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields()
      },
      cloudWatchRole: true
    });

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'Authorizer', {
      cognitoUserPools: [InvoicesUserPool.getUserPool()],
      identitySource: 'method.request.header.Authorization',
    });

    const apiRootResource = api.root.addResource("api");
    this.createSignUpMethod(apiRootResource);
    this.createSignInMethod(apiRootResource);
    this.createConfirmEmailMethod(apiRootResource);
    
    const invoicesRootResource = apiRootResource.addResource("invoices");
    this.createInvoicesMethod(invoicesRootResource, authorizer);

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

  private createSignUpMethod(resource: apigateway.Resource) {
    const lambdaIntegration = new apigateway.LambdaIntegration(
      SignUpLambda.getInstance().lambda, { proxy: true }
    );

    resource.addResource('sign-up').addMethod("POST", lambdaIntegration, {
      methodResponses: [{ statusCode: "200" }],
    });
  }

  private createSignInMethod(resource: apigateway.Resource) {
    const lambdaIntegration = new apigateway.LambdaIntegration(
      SignInLambda.getInstance().lambda, { proxy: true }
    );

    resource.addResource('sign-in').addMethod("POST", lambdaIntegration, {
      methodResponses: [{ statusCode: "200" }],
    });
  }

  private createConfirmEmailMethod(resource: apigateway.Resource) {
    const lambdaIntegration = new apigateway.LambdaIntegration(
      ConfirmEmailLambda.getInstance().lambda, { proxy: true }
    );

    resource.addResource('confirm-email').addMethod("POST", lambdaIntegration, {
      methodResponses: [{ statusCode: "200" }],
    });
  }

  private createInvoicesMethod(resource: apigateway.Resource, authorizer: apigateway.CognitoUserPoolsAuthorizer) {
    const lambdaIntegration = new apigateway.LambdaIntegration(
      CreateInvoicesLambda.getInstance().lambda, { proxy: true }
    );

    resource.addMethod("POST", lambdaIntegration, {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
      methodResponses: [{ statusCode: "200" }],
    });
  }

  private exportFixedOutputs(api: apigateway.RestApi) {
    new cdk.CfnOutput(this, `api-url`, { value: api.url });
  }
}
