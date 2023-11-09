import { APIGatewayEvent, Context } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { LambdaInput } from './lambda-input';
import { SignInMiddleware } from './validation-middleware';
import { ApiLambdaHandler } from '/opt/shared/utils/api-lambda/api-lambda-handler';
import { HttpStatusCode } from '/opt/shared/utils/api-lambda/http-status-code';
import { Exception } from '/opt/shared/utils/exception/exception';

const cognito = new CognitoIdentityServiceProvider();
const params = {
  userPoolClientId: process.env.USER_POOL_CLIENT_ID!!,
};

const lambdaHandler = async (event: APIGatewayEvent, _context: Context): Promise<{ token: string }> => {
  await SignInMiddleware.validate(event);

  const { body } = event;
  const { username, password } = JSON.parse(body!!) as LambdaInput;

  const cognitoParams = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: params.userPoolClientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const result = await cognito.initiateAuth(cognitoParams).promise();
    const idToken = result.AuthenticationResult?.IdToken;

    if (idToken === undefined) {
      throw Exception.new({ code: HttpStatusCode.ACCESS_DENIED_ERROR, overrideMessage: 'Authentication failed' });
    }

    return { token: idToken };
  } catch (error) {
    throw Exception.new({ code: HttpStatusCode.INTERNAL_ERROR, overrideMessage: 'Error signing in user' })
  }
}

const { handler } = new ApiLambdaHandler(lambdaHandler);
export { handler };
