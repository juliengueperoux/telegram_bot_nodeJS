const testContext = require('../test_context/test_context');
const clients = require('../utils/clients');
const telegram_bot_send_response_function = require('./utils').sendResponse

module.exports = function (telegram_bot) {
    /*
    * Method called when a message is sent to the bot
    */
    telegram_bot.on('message', async (msg) => {
        const text = msg.text.toString().toLowerCase();

        // We try to get an existing testContext
        let test_context = clients.get(msg.chat.id);

        // A new user, we create him a testContext
        if (!test_context) {
            test_context = new testContext(telegram_bot, msg.chat.id);
            clients.set(msg.chat.id, test_context)
        }
        const response = await test_context.onMessage(text);
        if (response != null) telegram_bot_send_response_function(telegram_bot, msg.chat.id, response);
    });
};