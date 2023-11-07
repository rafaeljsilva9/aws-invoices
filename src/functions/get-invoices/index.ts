import { APIGatewayEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { jwtDecode } from "jwt-decode";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  tableName: process.env.DYNAMODB_TABLE_NAME!!
};

export const handler: Handler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  const { headers: { Authorization } } = event;
  
  const { email } = jwtDecode(Authorization!!) as any;
  
  const invoices = await dynamoDb.query({
    TableName: params.tableName,
    IndexName: 'CustomerEmail',
    KeyConditionExpression: 'CustomerEmail = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  }).promise();

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({ invoices }),
  };

  return response;
}; 
