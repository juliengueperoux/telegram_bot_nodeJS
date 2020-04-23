const eventBus = require("../utils/eventBus")
const sendReponseToTelegramBot = require('./utils').sendResponse

module.exports = function (telegramBot) {
    
    eventBus.on("response", (chatId, response)=>{
        if (response != null) sendReponseToTelegramBot(telegramBot, chatId, response);
    })

}