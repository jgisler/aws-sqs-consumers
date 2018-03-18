const EventHandler = require('./lib/EventHandler');
const QueueProcessor = require('./lib/QueueProcessor');
const AwsClientFactory = require('./lib/AwsClientFactory');

/**
 * Lambda entry point, route requests to handler or processor
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 */
function handler(event, context, callback) {

   if(event.hasOwnProperty(queueUrl)) {

      return getQueueProcessor().processMessages(queueUrl)
         .then((result) => {
            console.log(`method=index.handler ${pp('event', event)} ${pp('result', result)}`);
            callback(null, result);
            return;
         }).catch((error) => {
            console.error(`method=index.handler ${pp('event', event)} ${ppErr(error)}`);
            callback(error);
            return;
         });

   } else {

      return getEventHandler().handleEvent(event)
         .then((result) => {
            console.log(`method=index.handler ${pp('event', event)} ${pp('result', result)}`);
            callback(null, result);
            return;
         }).catch((error) => {
            console.error(`method=index.handler ${pp('event', event)} ${ppErr(error)}`);
            callback(error);
            return;
         });
   }
}

function getEventHandler() {
   return EventHandler.getInstance(getClientFactory().getLambdaClient());
}

function getQueueProcessor() {
   return QueueProcessor.getInstance(getClientFactory().getS3Client(), getClientFactory().getSqsClient());
}

function getClientFactory() {
   return AwsClientFactory.getInstance();
}

function ppErr(error) {
   return `${pp('error', error)} stack=${error.stack}`;
}

function pp(name, obj) {
   return `${name}=${JSON.stringify(event, null, 2)}`;
}

