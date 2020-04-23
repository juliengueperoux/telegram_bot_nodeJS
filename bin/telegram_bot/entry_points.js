const TestContext = require('../test_context/testContext');
const clients = require('../utils/clients');
const eventBus = require("../../lib/event_bus/eventBus")

module.exports = function (telegramBot) {
    /*
    * Method called when a message is sent to the bot
    */
    telegramBot.on('message', async (msg) => {
        const text = msg.text.toString().toLowerCase();
        // We try to get an existing testContext
        let testContext = clients.get(msg.chat.id);

        // A new user, we create him a testContext
        if (!testContext) {
            testContext = new TestContext(eventBus, msg.chat.id);
            if (await testContext.init()) {
                clients.set(msg.chat.id, testContext)
                testContext.onMessage(text);
            }
        }
        else {
            // we send the text message to the testContext
            if (!testContext.isInitialized()) {
                if (await testContext.init()) {
                    testContext.onMessage(text);
                }
            }
            else{
                testContext.onMessage(text);
            }
        }
    });
};