
// Module Docs___________________________
// | Name: Message Event
// | Type: MANAGER
// | Function: Load Configuration Files
// |_____________________________________

module.exports = {
    enable(Discord, Client, Configuration, ModuleManager) {
        Client.on('message', (message) => {
            if (!message.author.bot && message) {
                ModuleManager.handle("message", message, Discord, Client, Configuration);
            }
        });
    }
};