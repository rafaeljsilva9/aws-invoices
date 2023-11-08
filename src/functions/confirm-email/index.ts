import { APIGatewayEvent, Context } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { LambdaInput } from './lambda-input';
import { ConfirmEmailMiddleware } from './validation-middleware';
import { ApiLambdaHandler } from '/opt/shared/utils/api-lambda/api-lambda-handler';
import { HttpStatusCode } from '/opt/shared/utils/api-lambda/http-status-code';
import { Exception } from '/opt/shared/utils/exception/exception';

const cognito = new CognitoIdentityServiceProvider();
const params = {
  userPoolClientId: process.env.USER_POOL_CLIENT_ID!!,
};

const lambdaHandler = async (event: APIGatewayEvent, _context: Context): Promise<{ confirmed: boolean }> => {
  await ConfirmEmailMiddleware.validate(event);

  const { body } = event;
  const { username, code } = JSON.parse(body!!) as LambdaInput;

  try {
    await cognito
      .confirmSignUp({
        ClientId: params.userPoolClientId,
        Username: username,
        ConfirmationCode: code,
      })
      .promise();

    return { confirmed: true };
  } catch (error) {
    throw Exception.new({ code: HttpStatusCode.INTERNAL_ERROR, overrideMessage: 'Error confirming user' });
  }
}

const { handler } = new ApiLambdaHandler(lambdaHandler);
export { handler };
