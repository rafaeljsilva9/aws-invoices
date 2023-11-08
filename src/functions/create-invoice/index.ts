import { APIGatewayEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { jwtDecode } from 'jwt-decode';
import { LambdaInput } from './lambda-input';
import { CreateInvoiceMiddleware } from './validation-middleware';
import { InvoiceDto } from '/opt/shared/dtos/Invoice';
import { InvoicesService } from '/opt/shared/services/invoices-service';
import { ApiLambdaHandler } from '/opt/shared/utils/api-lambda/api-lambda-handler';
import { InvoiceGenerator, InvoiceGeneratorPayload } from '/opt/shared/utils/invoice-generator';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  tableName: process.env.DYNAMODB_TABLE_NAME!!
};

const lambdaHandler = async (event: APIGatewayEvent, _context: Context): Promise<InvoiceDto> => {
  const { headers: { Authorization }, body } = event;
  const { email } = jwtDecode(Authorization!!) as any;

  await CreateInvoiceMiddleware.validate(event);

  const { dueDate, customerName, lineItems } = JSON.parse(body!!) as LambdaInput;
  const invoice: InvoiceGeneratorPayload = {
    dueDate,
    customerName,
    customerEmail: email,
    lineItems
  }

  const service = new InvoicesService(dynamoDb, params.tableName);
  const newInvoice = await service.createInvoice(InvoiceGenerator.generate(invoice));
  return InvoiceDto.fromObject(newInvoice);
}

const { handler } = new ApiLambdaHandler(lambdaHandler);
export { handler };
