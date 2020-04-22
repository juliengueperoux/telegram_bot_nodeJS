exports.sendResponse = (telegram_bot, chat_id, response)=>{
    response.forEach(element => {
        if(element.type == "message"){
            telegram_bot.sendMessage(chat_id, element.value);
        }
        else if(element.type == "photo"){
            telegram_bot.sendPhoto(chat_id, element.value);
        }
    })        
}