import { APIGatewayEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';

export const handler: Handler = async (_event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({ }),
  };

  return response;
}; 
