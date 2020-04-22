/**
* Send message to the telegram bot
*
* @param {TelegramBot} telegram_bot the instance of TelegramBot
* @param {Number} chat_id chat id
* @param {Object} response response created by the rocket launch detector
*/
exports.sendResponse = (telegram_bot, chat_id, response) => {
    response.forEach(element => {
        if (element.type == "message") {
            if (element.options) telegram_bot.sendMessage(chat_id, element.value, element.options);
            else telegram_bot.sendMessage(chat_id, element.value);
        }
        else if (element.type == "photo") {
            if (element.options) telegram_bot.sendPhoto(chat_id, element.value, element.options);
            else telegram_bot.sendPhoto(chat_id, element.value);
        }
    })
}