
// Module Docs___________________________
// | Name: Ready Event
// | Type: MANAGER
// | Function: Load Configuration Files
// |_____________________________________

module.exports = {
    enable(Discord, Client, Config, ModuleManager, cfgManager) {
        Client.on('ready', () => {
            if (!Config.getConfig().testVersion) {
                Client.user.setGame(`${Config.getConfig().prefix}help | ${Client.guilds.size} Servers | ${Client.users.size} Users`);
            }
            // Guild Config QuickCheck
            let count = 0;
            Client.guilds.forEach(guild => {
                if (guild.available) {
                    let DB = cfgManager.fetchGuildDB(guild);
                    if (cfgManager.guildConfigInit(guild)) count++;
                    ModuleManager.handle("guild_init", { guild: guild, config: DB }, Discord, Client, Config);
                }
            }
            );
            console.info(`[Config]: Generated/Updated ${count} Configurations This Boot.`);
            ModuleManager.handle("ready", null, Discord, Client, Config);
            console.log("[Client]: Ready!");
        });
    }
};