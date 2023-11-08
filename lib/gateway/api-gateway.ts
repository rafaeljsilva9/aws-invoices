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
import { GetInvoicesLambda } from "../lambdas/get-invoices-lambda";
import { DeleteInvoiceLambda } from "../lambdas/delete-invoice-lambda";
import { UpdateInvoiceLambda } from "../lambdas/update-invoice-lambda";

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
    const authResource = apiRootResource.addResource("auth");
    this.createSignUpMethod(authResource);
    this.createSignInMethod(authResource);
    this.createConfirmEmailMethod(authResource);

    const invoicesResource = apiRootResource.addResource("invoices");
    this.createInvoicesMethod(invoicesResource, authorizer);
    this.getInvoicesMethod(invoicesResource, authorizer);

    const invoiceIdResource = invoicesResource.addResource("{invoiceNumber}");
    this.deleteInvoicesMethod(invoiceIdResource, authorizer);
    this.updateInvoicesMethod(invoiceIdResource, authorizer);

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

  private getInvoicesMethod(resource: apigateway.Resource, authorizer: apigateway.CognitoUserPoolsAuthorizer) {
    const lambdaIntegration = new apigateway.LambdaIntegration(
      GetInvoicesLambda.getInstance().lambda, { proxy: true }
    );

    resource.addMethod("GET", lambdaIntegration, {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
      methodResponses: [{ statusCode: "200" }],
    });
  }

  private deleteInvoicesMethod(resource: apigateway.Resource, authorizer: apigateway.CognitoUserPoolsAuthorizer) {
    const lambdaIntegration = new apigateway.LambdaIntegration(
      DeleteInvoiceLambda.getInstance().getLambda(), { proxy: true }
    );

    resource.addMethod("DELETE", lambdaIntegration, {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
      methodResponses: [{ statusCode: "200" }],
    });
  }

  private updateInvoicesMethod(resource: apigateway.Resource, authorizer: apigateway.CognitoUserPoolsAuthorizer) {
    const lambdaIntegration = new apigateway.LambdaIntegration(
      UpdateInvoiceLambda.getInstance().getLambda(), { proxy: true }
    );

    resource.addMethod("PUT", lambdaIntegration, {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
      methodResponses: [{ statusCode: "200" }],
    });
  }

  private exportFixedOutputs(api: apigateway.RestApi) {
    new cdk.CfnOutput(this, `api-url`, { value: api.url });
  }
}
