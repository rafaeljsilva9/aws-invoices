import { APIGatewayEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import * as joi from 'joi';

export class GetInvoicesMiddleware {
  private static schema = joi.object().allow(null).keys({
    invoiceNumber: joi.string().optional(),
    invoiceDate: joi.string().optional(),
    dueDate: joi.string().optional(),
    status: joi.string().optional()
  });

  static async validate(event: APIGatewayEvent): Promise<void> {
    const input = event.queryStringParameters;
    await this.schema.validateAsync(input, {
      abortEarly: true,
    });
  }
}