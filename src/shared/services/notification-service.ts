export class NotificationService {
  constructor(
    private readonly sns: AWS.SNS,
    private readonly topicArn: string
  ) { }

  public async subscribe(email: string): Promise<void> {
    const subscription = await this.sns.listSubscriptionsByTopic({ TopicArn: this.topicArn }).promise();

    const isSubscribed = subscription.Subscriptions!!.some((subscription) => {
      return subscription.Protocol === 'email' && subscription.Endpoint === email;
    });

    if (!isSubscribed) {
      await this.sns.subscribe({
        Protocol: 'email',
        TopicArn: this.topicArn,
        Endpoint: email,
      }).promise();
    }
  }

  public async sendNotification(email: string, subject: string, message: string): Promise<void> {
    const publishParams = {
      Message: message,
      Subject: subject,
      TopicArn: this.topicArn,
      MessageAttributes: {
        email: {
          DataType: 'String',
          StringValue: email,
        },
      },
    };

    await this.sns.publish(publishParams).promise();
  }
}
