import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LambdaInput } from './lambda-input';
import { NotificationService } from '/opt/shared/services/notification-service';
import AWS = require('aws-sdk');

const sns = new AWS.SNS();

const params = {
  userPoolClientId: process.env.USER_POOL_CLIENT_ID!!,
  snsTopicArn: process.env.SNS_TOPIC_ARN!!,
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { body } = event;
  const { username, password, email } = JSON.parse(body!!) as LambdaInput;

  if (username === undefined || password === undefined || email === undefined) {
    return { statusCode: 400, body: 'Missing username, email, or password' };
  }

  const notificationService = new NotificationService(sns, params.snsTopicArn);

  await notificationService.subscribe(email);

  const cognito = new AWS.CognitoIdentityServiceProvider();

  const signUpParams = {
    ClientId: params.userPoolClientId,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  };

  try {
    await cognito.signUp(signUpParams).promise();
    return { statusCode: 200, body: 'User created' };
  } catch (error) {
    console.error('Error signing up user:', error);
    return { statusCode: 500, body: 'Error signing up user' };
  }
};
