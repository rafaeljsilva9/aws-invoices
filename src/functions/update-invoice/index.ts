import { APIGatewayEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { jwtDecode } from 'jwt-decode';
import { UpdateInvoiceMiddleware } from './validation-middleware';
import { Invoice } from '/opt/shared/models/Invoice';
import { InvoicesService } from '/opt/shared/services/invoices-service';
import { ApiLambdaHandler } from '/opt/shared/utils/api-lambda/api-lambda-handler';
import { Exception } from '/opt/shared/utils/exception/exception';
import { HttpStatusCode } from '/opt/shared/utils/api-lambda/http-status-code';
import { NotificationService } from '/opt/shared/services/notification-service';

const sns = new AWS.SNS();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const params = {
  tableName: process.env.DYNAMODB_TABLE_NAME!!,
  snsTopicArn: process.env.SNS_TOPIC_ARN!!
};

const lambdaHandler = async (event: APIGatewayEvent, _context: Context): Promise<Invoice> => {
  const { headers: { Authorization } } = event;
  const { email } = jwtDecode(Authorization!!) as any;

  await UpdateInvoiceMiddleware.validate(event);
  
  const { invoiceNumber } = event.pathParameters as any;
  const { status } = JSON.parse(event.body as any);
  const service = new InvoicesService(dynamoDb, params.tableName);
  const notificationService = new NotificationService(sns, params.snsTopicArn);
  const invoice = await service.getInvoice({ invoiceNumber, customerEmail: email });

  if (!invoice) {
    throw Exception.new({ code: HttpStatusCode.NOT_FOUND_ERROR, overrideMessage: 'The resource you want to update does not exist.' });
  }

  await notificationService.sendNotification(email, 'Invoice updates', `Your invoice of number ${invoiceNumber} has been updated. New status: ${status} `);
  const response = await service.updateInvoice(invoiceNumber, { CustomerEmail: email, Status: status });

  return response;
}

const { handler } = new ApiLambdaHandler(lambdaHandler);
export { handler };