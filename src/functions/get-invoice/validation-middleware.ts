import { APIGatewayEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import * as joi from 'joi';

export class GetInvoiceMiddleware {
  private static schema = joi.object().keys({
    invoiceNumber: joi.string().required(),
  });

  static async validate(event: APIGatewayEvent): Promise<void> {
    const input = event.pathParameters;
    await this.schema.validateAsync(input, {
      abortEarly: true,
    });
  }
}