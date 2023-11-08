import { APIGatewayEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import * as joi from 'joi';

export class UpdateInvoiceMiddleware {
  private static paramsSchema = joi.object().keys({
    invoiceNumber: joi.string().required(),
  });

  private static bodySchema = joi.object().keys({
    status: joi.string().valid('Paid','Unpaid', 'Pending').required()
  });

  static async validate(event: APIGatewayEvent): Promise<void> {
    const inputBody = JSON.parse(event.body!!);
    const inputParams = event.pathParameters;

    await this.paramsSchema.validateAsync(inputParams, {
      abortEarly: true,
    });

    await this.bodySchema.validateAsync(inputBody, {
      abortEarly: true,
    });
  }
}
