const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const AWS = require('aws-sdk');
const AWS_MOCK = require('aws-sdk-mock');
const Mocks = require('./MockResponses');

const QueueProcessor = require('../src/lib/QueueProcessor');

describe('QueueProcessor', () => {

   let messageId;
   let queueProcessor;

   before(() => {
      process.env.MaxNumberOfMessages = 10;
      process.env.MessageBucket = 'unit-test-bucket';
      process.env.ReceiveMessageWaitTimeInSeconds = 20;
      process.env.MessageVisibilityTimeoutInSeconds = 10;

      AWS_MOCK.mock('S3', 'putObject', (params, callback) => {
         callback(null, Mocks.S3_PUT_OBJECT_RESPONSE);
      });

      AWS_MOCK.mock('SQS', 'receiveMessage', (params, callback) => {
         callback(null, Mocks.SQS_RECEIVE_MESSAGE_RESPONSE);
      });

      AWS_MOCK.mock('SQS', 'deleteMessageBatch', (params, callback) => {
         callback(null, Mocks.SQS_DELETE_MESSAGE_BATCH_RESPONSE);
      });

      queueProcessor = new QueueProcessor(new AWS.S3(), new AWS.SQS());
   });

   after(() => {
      AWS_MOCK.restore('S3');
      AWS_MOCK.restore('SQS');

      delete process.env.MaxNumberOfMessages;
      delete process.env.MessageBucket;
      delete process.env.ReceiveMessageWaitTimeInSeconds;
      delete process.env.MessageVisibilityTimeoutInSeconds;
   });

   describe('deleteMessageBatch', () => {
      it('should return success', () => {
         const messages = Mocks.SQS_RECEIVE_MESSAGE_RESPONSE.Messages;
         return expect(queueProcessor.deleteMessages(messages, 'some-queue-url'))
            .to.eventually.deep.equal(Mocks.SQS_DELETE_MESSAGE_BATCH_RESPONSE);
      });
   });

   describe('saveMessage', () => {
      it('should return success', () => {
         const message = Mocks.SQS_RECEIVE_MESSAGE_RESPONSE.Messages[0];
         return expect(queueProcessor.saveMessage(message))
            .to.eventually.deep.equal(Mocks.S3_PUT_OBJECT_RESPONSE);
      });
   });

   describe('receiveMessages', () => {
      it('should return success', () => {
         return expect(queueProcessor.receiveMessages('some-queue-url'))
            .to.eventually.deep.equal(Mocks.SQS_RECEIVE_MESSAGE_RESPONSE);
      });
   });

   describe('persistMessages', () => {
      it('should return success', () => {
         return expect(queueProcessor.persistMessages(Mocks.SQS_RECEIVE_MESSAGE_RESPONSE.Messages))
            .to.eventually.deep.equal(Mocks.SQS_RECEIVE_MESSAGE_RESPONSE.Messages);
      });
   });

   describe('processMessages', () => {
      it('should return success', () => {
         return expect(queueProcessor.processMessages('some-queue-url'))
            .to.eventually.deep.equal(Mocks.SQS_DELETE_MESSAGE_BATCH_RESPONSE);
      });
   });
});