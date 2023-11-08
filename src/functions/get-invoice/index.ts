import { APIGatewayEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { jwtDecode } from 'jwt-decode';
import { GetInvoiceMiddleware } from './validation-middleware';
import { Invoice } from '/opt/shared/models/Invoice';
import { InvoicesService } from '/opt/shared/services/invoices-service';
import { ApiLambdaHandler } from '/opt/shared/utils/api-lambda/api-lambda-handler';
import { Exception } from '/opt/shared/utils/exception/exception';
import { HttpStatusCode } from '/opt/shared/utils/api-lambda/http-status-code';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  tableName: process.env.DYNAMODB_TABLE_NAME!!
};

const lambdaHandler = async (event: APIGatewayEvent, _context: Context): Promise<Invoice> => {
  const { headers: { Authorization } } = event;
  const { email } = jwtDecode(Authorization!!) as any;
  await GetInvoiceMiddleware.validate(event);
  const { invoiceNumber } = event.pathParameters as any;

  const service = new InvoicesService(dynamoDb, params.tableName);
  const invoice = await service.getInvoice({ invoiceNumber });

  if (invoice === undefined) {
    throw Exception.new({ code: HttpStatusCode.NOT_FOUND_ERROR });
  }

  const { CustomerEmail } = invoice;
  if (CustomerEmail !== email) {
    throw Exception.new({ code: HttpStatusCode.UNAUTHORIZED_ERROR });
  }
  return invoice;
}

const { handler } = new ApiLambdaHandler(lambdaHandler);
export { handler };
