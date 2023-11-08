import { APIGatewayEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import * as joi from 'joi';

export class CreateInvoiceMiddleware {
  private static schema = joi.object().keys({
    dueDate: joi.string().required(),
    customerName: joi.string().required(),
    lineItems: joi.array().required().items(joi.object().required().keys({
      itemName: joi.string().required(),
      quantity: joi.number().required(),
      unityPrice: joi.number().required(),
    })),
  });

  static async validate(event: APIGatewayEvent): Promise<void> {
    const input = JSON.parse(event.body!!);
    await this.schema.validateAsync(input, {
      abortEarly: true,
    });
  }
}