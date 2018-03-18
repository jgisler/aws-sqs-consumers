class EventHandler {

   static getInstance() {
      if(theInstance === undefined) {
         theInstance = new EventHandler();
      }
      return theInstance;
   }

   constructor() {
      this.class = this.constructor.name;
   }

   handleEvent(event) {
   }

}

let theInstance;
module.exports = EventHandler;