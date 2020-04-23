/*
* Map containg all our clients
*/
let Clients = module.exports = {
    clients: new Map(),
    set: function (chatId, testContext) {
        Clients.clients.set(chatId, testContext);
    },
    delete: function (chatId) {
        Clients.clients.delete(chatId);
    },
    get: function (chatId) {
        return Clients.clients.get(chatId);
    }
}