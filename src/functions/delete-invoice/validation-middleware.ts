import { APIGatewayEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import * as joi from 'joi';

export class DeleteInvoiceMiddleware {
  private static schema = joi.object().allow(null).keys({
    invoiceNumber: joi.string().optional(),
  });

  static async validate(event: APIGatewayEvent): Promise<void> {
    const input = event.pathParameters;
    await this.schema.validateAsync(input, {
      abortEarly: true,
    });
  }
}