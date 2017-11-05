
// Module Docs___________________________
// | Name: Event Handler
// | Type: MANAGER
// | Function: Set up all events
// |_____________________________________

module.exports = {
    enable(Discord, Client, Configuration, ModuleManager, cfgManager) {
        var memberEvent = (member, event) => {
            if (member && event) {
                const DB = cfgManager.fetchGuildDB(member.guild);
                ModuleManager.handle(event, { member: member, guild: member.guild, config: DB }, Discord, Client, Configuration);
            }
        };
        Client.on('guildMemberRemove', member => memberEvent(member, "member_remove"));
        Client.on('guildMemberAdd', member => memberEvent(member, "member_add"));
        Client.on('guildMemberUpdate', (memberOld, memberNew) => {
            if (memberOld && memberNew) {
                const DB = cfgManager.fetchGuildDB(memberNew.guild);
                ModuleManager.handle("member_update", { memberOld: memberOld, memberNew: memberNew, guild: memberNew.guild, config: DB }, Discord, Client, Configuration);
            }
        });
    }
};