/**
 * Receive messages from a queue, write messages to S3 bucket, delete the messages
 */
class QueueProcessor {

   static getInstance(s3Client, sqsClient) {
      if (theInstance === undefined) {
         theInstance = new QueueProcessor(s3Client, sqsClient);
      }
      return theInstance;
   }

   constructor(s3Client, sqsClient) {
      this.class = this.constructor.name;

      this.s3Client = s3Client;
      this.sqsClient = sqsClient;

      this.waitTimeInSeconds = process.env.ReceiveMessageWaitTimeInSeconds;
      this.messageVisibilityTimeoutInSeconds = process.env.MessageVisibilityTimeoutInSeconds;
      this.maxNumberOfMessages = process.env.MaxNumberOfMessages;
      this.messageBucket = process.env.MessageBucket;
   }

   processMessages(queueUrl) {
      return this.receiveMessages(queueUrl)
         .then((result) => this.persistMessages(result.Messages))
         .then((messages) => this.deleteMessages(messages, queueUrl));
   }

   persistMessages(messages) {
      return Promise.all(
         messages.map((message) => this.saveMessage(message))
      ).then(() => messages);
   }

   receiveMessages(queueUrl) {
      return this.sqsClient.receiveMessage({
         QueueUrl: queueUrl,
         WaitTimeSeconds: this.waitTimeInSeconds,
         VisibilityTimeout: this.messageVisibilityTimeoutInSeconds,
         MaxNumberOfMessages: this.maxNumberOfMessages
      }).promise();
   }

   saveMessage(message) {
      return this.s3Client.putObject({
         Bucket: this.messageBucket,
         Key: `${message.MessageId}.json`,
         ContentType: 'application/json',
         Body: JSON.stringify(message.Body)
      }).promise();
   }

   deleteMessages(messages, queueUrl) {
      return this.sqsClient.deleteMessageBatch({
         Entries : messages.map((message) => {
            return {
               Id: message.MessageId,
               ReceiptHandle: message.ReceiptHandle
            };
         }),
         QueueUrl: queueUrl
      }).promise();
   }
}

let theInstance;
module.exports = QueueProcessor;