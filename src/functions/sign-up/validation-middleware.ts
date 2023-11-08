import { APIGatewayEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import * as joi from 'joi';

export class SignUpMiddleware {
  private static schema = joi.object().keys({
    username: joi.string().required(),
    password: joi.string().required(),
    email: joi.string().required(),
  });

  static async validate(event: APIGatewayEvent): Promise<void> {
    const input = JSON.parse(event.body!!);
    await this.schema.validateAsync(input, {
      abortEarly: true,
    });
  }
}