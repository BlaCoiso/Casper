
// Module Docs___________________________
// | Type: SUPERMANAGER
// | Function: Hold Bot Structure
// |_____________________________________

module.exports = {
    checkDev: function (Client, userObject, configObject) {
        try {
            let allowed = false;
            let guildMember = Client.guilds.get(configObject.getConfig().dev_server).member(userObject);
            if (guildMember) allowed = guildMember.roles.get(configObject.getConfig().dev_role);
            return allowed;
        } catch (e) {
            console.error("Can't check for dev: " + e.message);
        }
    },
    checkMod(Client, userObj, configObj, guildObj) {
        try {
            var isMod = false;
            var modRoles = configObj.getData("/modRoles");
            if (configObj && guildObj) {
                for (var i = 0; i < modRoles.length; ++i) {
                    var role = modRoles[i];
                    isMod = guildObj.member(userObj).roles.get(role) || isMod;
                }
            }
            return !!isMod;
        } catch (e) {
            console.error("Can't check if is moderator: " + e.message);
        }
    },
    checkAdmin(Client, userObj, configObj, guildObj) {
        try {
            var isAdmin = false;
            var adminRoles = configObj.getData("/adminRoles");
            if (configObj && guildObj) {
                for (var i = 0; i < adminRoles.length; ++i) {
                    var role = adminRoles[i];
                    isAdmin = guildObj.member(userObj).roles.get(role) || isAdmin;
                }
            }
            return !!isAdmin;
        } catch (e) {
            console.error("Can't check if is admin: " + e.message);
        }
    },
    getModPerms(config) {
        try {
            return config.getData("/modPerms");
        } catch (e) {
            console.error("Can't get mod perms");
        }
    }
}

