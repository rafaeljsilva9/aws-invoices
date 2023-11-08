import { APIGatewayEvent, Context } from 'aws-lambda';
import { LambdaInput } from './lambda-input';
import { SignUpMiddleware } from './validation-middleware';
import { NotificationService } from '/opt/shared/services/notification-service';
import { ApiLambdaHandler } from '/opt/shared/utils/api-lambda/api-lambda-handler';
import { HttpStatusCode } from '/opt/shared/utils/api-lambda/http-status-code';
import { Exception } from '/opt/shared/utils/exception/exception';
import AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();
const sns = new AWS.SNS();
const params = {
  userPoolClientId: process.env.USER_POOL_CLIENT_ID!!,
  snsTopicArn: process.env.SNS_TOPIC_ARN!!,
};

const lambdaHandler = async (event: APIGatewayEvent, _context: Context): Promise<{ created: true }> => {
  await SignUpMiddleware.validate(event);

  const { body } = event;
  const { username, password, email } = JSON.parse(body!!) as LambdaInput;

  const notificationService = new NotificationService(sns, params.snsTopicArn);

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
    await notificationService.subscribe(email);
    return { created: true };
  } catch (error) {
    throw Exception.new({ code: HttpStatusCode.INTERNAL_ERROR, overrideMessage: 'Error signing up user' })
  }
}

const { handler } = new ApiLambdaHandler(lambdaHandler);
export { handler };
