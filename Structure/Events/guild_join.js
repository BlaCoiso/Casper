var JDB = require('node-json-db');

// Module Docs___________________________
// | Name: Ready Event
// | Type: MANAGER
// | Function: Load Configuration Files
// |_____________________________________

module.exports = {

    enable: function (Client, Config) {
        Client.on('guildCreate', (guild) => {
            if (!Config.getConfig().testVersion) guild.defaultChannel.sendMessage("Hello, I'm Casper Bot. Start by doing `=autoConfig`, then do `=help` for a list of commands.\nIf you want to change the prefix or other settings, use the `=config` command.\nIf you have any questions / suggestions / bug reports, feel free to do `=invite` and join our server!");
            // Guild Config QuickCheck
            var DB = new JDB(`./Database/Guilds/${guild.id}-settings`, true, true);
            var version = 2;
            try {
                let testDB = DB.getData("/name");
                let testv = DB.getData("/confver");
                if (testv != version) {
                    throw new Error("RIP, recreating config");
                }
            } catch (e) {
                try {
                    console.log(`[Cfg] Generated Config for ${guild.id}`);
                    DB.push(`${guild.id}`,
                        {
                            name: guild.name,
                            prefix: "",
                            blacklisted: false,
                            autoConf: false,
                            modRoles: [],
                            adminRoles: [],
                            logChannel: "",
                            joinChannel: "",
                            modPerms: [],
                            confver: version
                        }, true
                );
                } catch (e) {
                    console.error("Error: " + e.message);
                }
            }
        });
    }

}