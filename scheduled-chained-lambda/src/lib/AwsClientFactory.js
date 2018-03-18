class AwsClientFactory {

   static getInstance() {
      if(theInstance === undefined) {
         const AWS = require('aws-sdk');
         theInstance = new AwsClientFactory(AWS);
      }
      return theInstance;
   }

   constructor(AWS) {
      this.class = this.constructor.name;
      this.AWS = AWS;
   }

   getS3Client() {
      if(this.s3client === undefined) {
         this.s3client = new this.AWS.S3({apiVersion: '2006-03-01'});
      }
      return this.s3client;
   }

   getSqsClient() {
      if(this.sqsClient === undefined) {
         this.sqsClient = new this.AWS.SQS({apiVersion: '2012-11-05'});
      }
      return this.sqsClient;
   }
}

let theInstance;
module.exports = AwsClientFactory;