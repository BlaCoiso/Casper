var JDB = require('node-json-db');

// Module Docs___________________________
// | Name: Ready Event
// | Type: MANAGER
// | Function: Load Configuration Files
// |_____________________________________

module.exports = {

    enable: function (Client, Config) {
        Client.on('guildCreate', (guild) => {

            // Guild Config QuickCheck
            var DB = new JDB(`./Database/Guilds/${guild.id}-settings`, true, true)

            try {
                let testDB = DB.getData(`/name`);
            } catch (e) {
                try {
                    console.log(`[Cfg] Generated Config for ${guild.id}`);
                    DB.push(`${guild.id}`,
                        {
                            name: `${guild.name}`,
                            prefix: `${Config.getConfig().prefix}`,
                            blacklisted: false,
                            autoConf: false,
                            modRoles: [],
                            adminRoles: [],
                            logChannel: "",
                            joinChannel: "",
                            modPerms: []
                        }, false
                    );
                } catch (e) {
                    console.error("Error: " + e.message);
                }
            }
        });
    }

}