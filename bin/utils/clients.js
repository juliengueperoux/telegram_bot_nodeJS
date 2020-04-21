
/*
* Map containg all our clients
*/
let Clients = module.exports = {
    clients: new Map(),
    set: function (chat_id, rocket_launch_detector) {
        Clients.clients.set(chat_id, rocket_launch_detector);
    },
    delete: function (chat_id) {
        Clients.clients.delete(chat_id);
    },
    get: function (chat_id) {
        return Clients.clients.get(chat_id);
    }
}