import { Context } from "aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { ExceptionHandler } from "../exception/exception-handler";
import { HttpStatusCode } from "./http-status-code";

class ApiLambdaHandler<TBodyResponse> {
  constructor(
    private lambdaBodyHandler: (event: APIGatewayProxyEvent, context: Context) => Promise<TBodyResponse>
  ) { }

  private handlerSuccess(bodyResponse: TBodyResponse): APIGatewayProxyResult {
    return {
      statusCode: HttpStatusCode.SUCCESS.code,
      body: JSON.stringify({ data: bodyResponse }),
    };
  }

  private handlerError(error: Error): APIGatewayProxyResult {
    return ExceptionHandler.handler(error);
  }

  public handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    let result;

    try {
      const bodyResult = await this.lambdaBodyHandler(event, context);

      result = this.handlerSuccess(bodyResult);
    } catch (error: any) {
      result = this.handlerError(error);
    }

    return result;
  };
}

export { ApiLambdaHandler };