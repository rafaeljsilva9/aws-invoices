import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { LambdaInput } from './lambda-input';

const client = new CognitoIdentityProviderClient({});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { body } = event;
  const { username, password, email } = JSON.parse(body!) as LambdaInput;

  if (username === undefined || password === undefined || email === undefined) {
    return Promise.resolve({ statusCode: 400, body: 'Missing username, email or password' });
  }

  const userPoolClientId = process.env.USER_POOL_CLIENT_ID;

  await client.send(
    new SignUpCommand({
      ClientId: userPoolClientId,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    }),
  );

  return { statusCode: 200, body: 'User created' };
};
