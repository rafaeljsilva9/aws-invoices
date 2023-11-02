import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { LambdaInput } from './lambda-input';

const client = new CognitoIdentityProviderClient({});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { body } = event;
  const { username, code } = JSON.parse(body!) as LambdaInput;

  if (username === undefined || code === undefined) {
    return Promise.resolve({ statusCode: 400, body: 'Missing username or confirmation code' });
  }

  const userPoolClientId = process.env.USER_POOL_CLIENT_ID;

  await client.send(
    new ConfirmSignUpCommand({
      ClientId: userPoolClientId,
      Username: username,
      ConfirmationCode: code,
    }),
  );

  return { statusCode: 200, body: 'User confirmed' };
};
