var JDB = require('node-json-db');

// Module Docs___________________________
// | Name: Ready Event
// | Type: MANAGER
// | Function: Load Configuration Files
// |_____________________________________

module.exports = {

    enable: function (Client, Config) {
        var count = 0;
        Client.on('ready', () => {
            if (!Config.getConfig().testVersion) {
                Client.user.setGame(Config.getConfig().prefix + "help " + "| " + Client.guilds.size + " Servers" + " | " + Client.users.size + " Users");
            }
            // Guild Config QuickCheck
            Client.guilds.forEach(guild => {
                var DB = new JDB(`./Database/Guilds/${guild.id}-settings`, true, true);
                var version = 2; //Current config version, change when new things added (also change guild_join.js)
                try {
                    let testDB = DB.getData(`/name`);
                    let pref = DB.getData(`/prefix`);
                    let pref2 = Config.getConfig().prefix;
                    if (pref == pref2) {
                        DB.push("/prefix", "", true);
                    }
                    let confVers = DB.getData(`/confver`);
                    if (confVers == 1) {
                        DB.push("/autoConf", false, true);
                    }
                    if (confVers != version) {
                        throw "Config version doesn't match";
                    }
                } catch (e) {
                    try {
                        var current = DB.getData("/");
                        DB.push(`${guild.id}`,
                            {
                                name: current.name || guild.name,
                                prefix: current.prefix || "",
                                blacklisted: current.blacklisted || false,
                                autoConf: current.autoConf || false,
                                modRoles: current.modRoles||[],
                                adminRoles: current.adminRoles||[],
                                logChannel: current.logChannel || "",
                                joinChannel: current.joinChannel || "",
                                modPerms: current.modPerms||[],
                                confver: version
                            }, true
                        );
                        count++;
                    } catch (e) {
                        console.log("Can't save config: " + e.message);
                    }
                }
            });
            console.log(`[Config] Generated ${count} Configurations This Boot.`);
            console.log("[Client] Ready!");
        });
    }
}
