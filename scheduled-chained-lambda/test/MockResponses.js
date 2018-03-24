const S3_PUT_OBJECT_RESPONSE = {
   ETag: "\"test-etag-value\""
};

const SQS_RECEIVE_MESSAGE_RESPONSE = {
   Messages: [{
      Body: {
         Thing: {
            thatThing: 200,
            differentThing: [
               "list item 0",
               "list item 1"
            ]
         }
      },
      MessageId: 'test-message-id',
      ReceiptHandle: 'test-reciept-handle'
   }]
};

const SQS_DELETE_MESSAGE_BATCH_RESPONSE = {
   Successful: [{
      Id: 'test-message-id'
   }],
   Failed: []
};

module.exports = {
   S3_PUT_OBJECT_RESPONSE,
   SQS_RECEIVE_MESSAGE_RESPONSE,
   SQS_DELETE_MESSAGE_BATCH_RESPONSE
};