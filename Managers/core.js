// Discord API
const Discord = require('discord.js');
const DisabledEvents = ["TYPING_START", "USER_NOTE_UPDATE", "VOICE_SERVER_UPDATE", "VOICE_STATE_UPDATE", "CHANNEL_PINS_UPDATE", "MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"];
const Client = new Discord.Client({ fetchAllMembers: true, disabledEvents: DisabledEvents });

// Module Docs___________________________
// | Type: SUPERMANAGER
// | Function: Hold Bot Structure
// |_____________________________________

// Events
const MessageEvent = require('../Structure/Events/message.js');
const GuildJoinEvent = require('../Structure/Events/guild_join.js');
const ReadyEvent = require('../Structure/Events/ready.js');
const EventHandler = require('../Structure/Events/event_handler.js');

// System Modules
const Configuration = require('../Structure/Configuration/loader-conf.js'); // CFG Module
const ModuleManager = require('./moduleManager.js'); // Module Manager Module
const ConfigManager = require('./configManager.js'); // Config Manager Module


// Finalization Calls (Login)
function finalize() {
    build();
    try {
        ReadyEvent.enable(Discord, Client, Configuration, ModuleManager, ConfigManager);
        Client.login(Configuration.getConfig().token);
    }
    catch (e) { console.error(`[Boot] Connection Failed...\n - Reason: ${e.message}`); }
}

function build() {
    ConfigManager.init("./Database/GuildDB.json", Client, { prefix: Configuration.getConfig().prefix });
    ModuleManager.init(Discord, Client, Configuration, ConfigManager);
    ModuleManager.loadModules(Configuration.getModules(), ConfigManager.getInitCallback());
    MessageEvent.enable(Discord, Client, Configuration, ModuleManager);
    EventHandler.enable(Discord, Client, Configuration, ModuleManager, ConfigManager);
    GuildJoinEvent.enable(Discord, Client, Configuration, ModuleManager, ConfigManager);
    Client.on("error", e=>console.error(`[Client]: ${e.name}: ${e.message}`));
    Client.on("disconnect", s=>console.error(`[Client]: Disconnected: Code ${s.code} ${s.reason}`));
}

// Module Export Calls (Load Files, Init JS)
module.exports = {
    enable() {
        finalize();
    }
};