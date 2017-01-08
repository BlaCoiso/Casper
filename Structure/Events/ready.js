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
            Client.user.setGame(Config.getConfig().prefix + "help " + "| " + Client.guilds.size + " Servers" + " | " + Client.users.size + " Users");
            // Guild Config QuickCheck
            Client.guilds.forEach(guild => {
                var DB = new JDB(`./Database/Guilds/${guild.id}-settings`, true, true);
                try {
                    let testDB = DB.getData(`/name`);
                    let testConf = DB.getData(`/autoConf`);
                    let pref = DB.getData(`/prefix`);
                    let pref2 = Config.getConfig().prefix;
                    if (pref == pref2) {
                        DB.push("/prefix", "", true);
                    }
                } catch (e) {
                    try {
                        DB.push(`${guild.id}`,
                            {
                                name: `${guild.name}`,
                                prefix: "",
                                blacklisted: false,
                                autoConf: false,
                                modRoles: [],
                                adminRoles: [],
                                logChannel: "",
                                joinChannel: "",
                                modPerms: []
                            }, false
                        );
                        count = count + 1;
                    } catch (e) {
                    }
                }
            });
            console.log(`[Config] Generated ${count} Configurations This Boot.`);
            console.log("[Client] Ready!");
        });
    }
}