import { APIGatewayEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import { LambdaInput } from './lambda-input';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  tableName: process.env.DYNAMODB_TABLE_NAME!!
};

export const handler: Handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  const { body } = event;
  const invoice = JSON.parse(body!) as LambdaInput;

  await dynamoDb
  .put({
    TableName: params.tableName,
    Item: invoice,
  })
  .promise();

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({ }),
  };

  return response;
}; 
