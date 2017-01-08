// Discord API
const Discord = require('discord.js');
const Client = new Discord.Client({ fetchAllMembers: true });

// Module Docs___________________________
// | Type: SUPERMANAGER
// | Function: Hold Bot Structure
// |_____________________________________

// Events
var MessageEvent = require('../Structure/Events/message.js');
var GuildJoinEvent = require('../Structure/Events/guild_join.js');
var ReadyEvent = require('../Structure/Events/ready.js');

// System Modules
var Configuration = require('../Structure/Configuration/loader-conf.js'); // CFG Module
var Database = require('../Database/loader-db.js'); // DB Module



// Finalization Calls (Login)
function finalize() {
    build();
    try {
        ReadyEvent.enable(Client, Configuration)
        Client.login(Configuration.getConfig().token);
    }
    catch (e) { console.error("[Boot] Connection Failed...\n - Reason: " + e.message); }
}

function build() {
    MessageEvent.enable(Discord, Client, Configuration);
    GuildJoinEvent.enable(Client, Configuration);
}

// Module Export Calls (Load Files, Init JS)
module.exports = {
    enable: function () {
        finalize();
    }
}

