import { APIGatewayEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import * as joi from 'joi';

export class ConfirmEmailMiddleware {
  private static schema = joi.object().keys({
    username: joi.string().required(),
    code: joi.string().required(),
  });

  static async validate(event: APIGatewayEvent): Promise<void> {
    const input = JSON.parse(event.body!!);
    await this.schema.validateAsync(input, {
      abortEarly: true,
    });
  }
}