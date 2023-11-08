import { APIGatewayEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { jwtDecode } from 'jwt-decode';
import { GetInvoicesMiddleware } from './validation-middleware';
import { InvoiceDto } from '/opt/shared/dtos/Invoice';
import { InvoicesService } from '/opt/shared/services/invoices-service';
import { ApiLambdaHandler } from '/opt/shared/utils/api-lambda/api-lambda-handler';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  tableName: process.env.DYNAMODB_TABLE_NAME!!
};

const lambdaHandler = async (event: APIGatewayEvent, _context: Context): Promise<InvoiceDto[]> => {
  const { headers: { Authorization } } = event;
  const { email } = jwtDecode(Authorization!!) as any;
  await GetInvoicesMiddleware.validate(event);

  const queryParams = event.queryStringParameters as any;
  let invoiceStatus = undefined;

  if (queryParams) {
    invoiceStatus = queryParams.status;
  }

  const service = new InvoicesService(dynamoDb, params.tableName);
  const invoices = await service.getInvoices({ customerEmail: email, invoiceStatus });
  return InvoiceDto.fromArray(invoices);
}

const { handler } = new ApiLambdaHandler(lambdaHandler);
export { handler };
