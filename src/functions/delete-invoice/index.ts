import { APIGatewayEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { jwtDecode } from 'jwt-decode';
import { ApiLambdaHandler } from '/opt/shared/utils/api-lambda/api-lambda-handler';
import { DeleteInvoiceMiddleware } from './validation-middleware';
import { InvoicesService } from '/opt/shared/services/invoices-service';
import { Invoice } from '/opt/shared/models/Invoice';
import { Exception } from '/opt/shared/utils/exception/exception';
import { HttpStatusCode } from '/opt/shared/utils/api-lambda/http-status-code';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  tableName: process.env.DYNAMODB_TABLE_NAME!!
};

const lambdaHandler = async (event: APIGatewayEvent, _context: Context): Promise<{ deleted: boolean}> => {
  const { headers: { Authorization } } = event;
  const { email } = jwtDecode(Authorization!!) as any;

  await DeleteInvoiceMiddleware.validate(event);

  const { invoiceNumber } = event.pathParameters as any;
  const service = new InvoicesService(dynamoDb, params.tableName);
  const invoice = await service.getInvoice(invoiceNumber);

  if (!invoice) {
    throw Exception.new({ code: HttpStatusCode.NOT_FOUND_ERROR, overrideMessage: 'The resource you want to delete does not exist.' });
  }

  const { CustomerEmail } = invoice;
  if (CustomerEmail !== email) {
    throw Exception.new({ code: HttpStatusCode.UNAUTHORIZED_ERROR });
  }

  await service.deleteInvoice(invoiceNumber);
  return { deleted: true };
}

const { handler } = new ApiLambdaHandler(lambdaHandler);
export { handler };
