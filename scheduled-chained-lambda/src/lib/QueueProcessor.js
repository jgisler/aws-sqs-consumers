/**
 * Receive messages from a queue, write messages to S3 bucket, delete the messages
 */
class QueueProcessor {

   static getInstance(s3Client, sqsClient) {
      if(theInstance === undefined) {
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
   }

   processMessages(queueUrl) {

      return this.receiveMessages(queueUrl)
         .then((result) => this.persistMessages(result.Messages))
         .then((result) => this.deleteMessages(queueUrl, result));

   }

   receiveMessages(queueUrl) {
      return this.sqsClient.receiveMessages({
         QueueUrl: queueUrl,
         WaitTimeSeconds: this.waitTimeInSeconds,
         VisibilityTimeout: this.messageVisibilityTimeoutInSeconds,
         MaxNumberOfMessages: this.maxNumberOfMessages
      }).promise();
   }

   persistMessages(messages) {
      messages.forEach((message) => {
         
      });
   }

}

let theInstance;
module.exports = QueueProcessor;