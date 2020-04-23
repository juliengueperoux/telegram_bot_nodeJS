const eventBus = require("../../lib/event_bus/eventBus")
const sendReponseToTelegramBot = require('./utils').sendResponse

module.exports = function (telegramBot) {
    
    /*
    * "response" topic on the eventBus. All responses sent to the telegram Bot go by this method.
    */
    eventBus.on("response", (chatId, response)=>{
        if (response != null) sendReponseToTelegramBot(telegramBot, chatId, response);
    })

}