import { APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { HttpStatusCode } from "../api-lambda/http-status-code";
import { Exception } from "./exception";

export class ExceptionHandler {
  private static readonly VALIDATION_ERROR = 'ValidationError';
  public static handler(err: Error): APIGatewayProxyResult {
    const errorResponse = this.handleException(err)

    return errorResponse;
  }

  private static handleException(error: Error): APIGatewayProxyResult {
    if (error instanceof Exception) {
      return {
        statusCode: error.code,
        body: JSON.stringify({ code: error.code, message: error.message }),
      };
    }

    if (ExceptionHandler.isValidationError(error)) {
      return {
        statusCode: HttpStatusCode.BAD_REQUEST_ERROR.code,
        body: JSON.stringify({ code: HttpStatusCode.BAD_REQUEST_ERROR.code, message: error.message }),
      };
    }

    return {
      statusCode: HttpStatusCode.INTERNAL_ERROR.code,
      body: JSON.stringify({ code: HttpStatusCode.INTERNAL_ERROR.code, message: error.message }),
    };
  }

  private static isValidationError(error: Error) {
    return error.name === ExceptionHandler.VALIDATION_ERROR;
  }
}
