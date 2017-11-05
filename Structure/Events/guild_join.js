
// Module Docs___________________________
// | Name: Ready Event
// | Type: MANAGER
// | Function: Load Configuration Files
// |_____________________________________

module.exports = {
    enable(Discord, Client, Config, ModuleManager, cfgManager) {
        Client.on('guildCreate', (guild) => {
            let DB = cfgManager.fetchGuildDB(guild);
            cfgManager.guildConfigInit(guild);
            ModuleManager.handle("guild_create", { guild: guild, config: DB }, Discord, Client, Config);
            ModuleManager.handle("guild_init", { guild: guild, config: DB }, Discord, Client, Config);
        });
    }
};