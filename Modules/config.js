
// Module Docs___________________________
// | Name: Config
// | Type: MODULE
// | Function: Manage bot configuration
// |_____________________________________

module.exports = {
    handler: function (message, command, params, config, data) {
        if (this.handles.indexOf(command) != -1) {
            if (command == "autoconfig" || command == "autoconf" && data.isDM) {
                this.autoConfig(message, data, config);
            } else if (command == "config" || command == "configset" || command == "botconfig" || command == "setconf") {
                this.setConfig(message, params, config, data);
            }
        }
    },
    handles: ["autoconf", "autoconfig", "config", "configset", "botconfig", "setconf"],
    helpMessage: "**Configuration commands**:\n `autoconfig`: Automatically detects config.\n" +
        " `config`: Changes the config for the server, will only work after running `autoconfig`, only works if you have admin permissions.\n",
    autoConfig: function (message, data, config) {
        if (!config.getData("/autoConf")) {
            var send = "Trying to automatically detect config...";
            var botMember = message.guild.member(data.client.user);
            var noPerms = false;
            if (!botMember.hasPermission("KICK_MEMBERS")) {
                send += "\nWarning: Bot can't kick.";
                noPerms = true;
            }
            if (!botMember.hasPermission("BAN_MEMBERS")) {
                send += "\nWarning: Bot can't ban.";
                noPerms = true;
            }
            if (!botMember.hasPermission("MANAGE_MESSAGES")) {
                send += "\nWarning: Bot can't manage messages.";
                noPerms = true;
            }
            if (!botMember.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
                send += "\nWarning: Bot can't manage roles.";
                noPerms = true;
            }
            if (!botMember.hasPermission("ATTACH_FILES")) {
                send += "\nWarning: Bot can't attach files.";
                noPerms = true;
            }
            if (noPerms) send += "\n**Bot is missing permissions, commands might not work properly**\n";
            var serverRoles = message.guild.roles.array();
            var adminRoles = [];
            var modRoles = [];
            var adminNames = [];
            var modNames = [];
            for (var i = 0; i < serverRoles.length; ++i) {
                var role = serverRoles[i];
                if (role) {
                    if (role.hasPermission("ADMINISTRATOR")) {
                        adminRoles.push(role.id);
                        adminNames.push(role.name);
                    }
                    if (role.name.toLowerCase().includes("mod")) {
                        modRoles.push(role.id);
                        modNames.push(role.name);
                    }
                }
            }
            message.reply(send + "\n\nFound config: \nMod roles: " + modNames.toString() + "\nAdmin roles: " + adminNames.toString() + "\nTo change the config, do the command " + data.prefix + "config.");
            try {
                config.push("/modRoles", modRoles, true);
                config.push("/adminRoles", adminRoles, true);
                config.push("/autoConf", true, true);
            } catch (e) {
                console.error("Can't save config: " + e.message);
            }
        }
    },
    setConfig: function (message, params, config, data) {
        try {
            if (!data.isDM && data.admin && config.getData("/autoConf")) {
                if (params.length == 0) {
                    var out = "Server config manager (unfinished)\n**List of available options**:\n";
                    out += "*action-log*: Select a channel to log moderator actions\n";
                    out += "*join-channel*: Select a channel to log when user joins/leaves\n";//Unimplemented
                    out += "*modrole*: Selects roles with moderator permissions\n";
                    out += "*adminrole*: Selects roles with admin permissions (**WARNING: Gives access to config**)\n";
                    out += "*modperms*: Selects permissions of moderators\n";
                    out += "*prefix*: Selects a new prefix for the bot";
                    message.channel.sendMessage(out);
                } else if (params.length == 1) {
                    var cfgval = params[0].toLowerCase();
                    if (cfgval == "action-log" || cfgval == "actionlog" || cfgval == "mod-log" || cfgval == "modlog") {
                        message.channel.sendMessage("*" + cfgval + "*: Sets a channel to log moderator actions. Use \"reset\n to stop logging and mention a channel or put the channel name after it.");
                    } else if (cfgval == "modrole") {
                        message.channel.sendMessage("*modrole*: Sets a role with moderator permissions.\nUse \"add\" to add a role and \"remove\" to remove a role and put the role name after it.");
                    } else if (cfgval == "adminrole") {
                        message.channel.sendMessage("*adminrole*: Sets a role with admin permissions. (Can use config)\nUse add to add a role and remove to remove a role and put the role name after it.");
                    } else if (cfgval == "modperms") {
                        message.channel.sendMessage("*modperms*: Sets permissions of moderators.\nUse add or remove to add permissions.\n**List of permissions**: *Ban*, *Kick*, *Messages*, *Roles*");
                    } else if (cfgval == "prefix") {
                        message.channel.sendMessage("*prefix*: Sets a new prefix for the bot on the current server.\nUse \"reset\" to reset the prefix.");
                    }
                } else {
                    var cfgval = params[0].toLowerCase();
                    if ((cfgval == "action-log" || cfgval == "actionlog" || cfgval == "mod-log" || cfgval == "modlog") && params[1] && params[1] != "") {
                        var ch = message.mentions.channels.first() || message.guild.channels.find("name", params[1]);
                        if (ch && params[1].toLowerCase() != "reset") {
                            config.push("/logChannel", ch.id, true);
                            message.reply("Set logging channel to " + ch);
                        } else if (params[1].toLowerCase() == "reset") {
                            config.push("/logChannel", "", true);
                            message.reply("Disabled action log.");
                        } else {
                            message.reply("Can't find channel.");
                        }
                    } else if (cfgval == "modrole" && params[1] && params[1] != "" && params[2] && params[2] != "") {
                        var role = message.mentions.roles.first() || message.guild.roles.find("name", params[2]);
                        var roleCfg = config.getData("/modRoles");
                        if (role && params[1].toLowerCase() == "add") {
                            roleCfg.push(role.id);
                            config.push("/modRoles", roleCfg, true);
                            message.reply("Added " + role.name + " to moderator roles.");
                        } else if (role && params[1].toLowerCase() == "remove") {
                            var ind = roleCfg.indexOf(role.id);
                            if (ind > -1) {
                                roleCfg.splice(ind, 1);
                                config.push("/modRoles", roleCfg, true);
                                message.reply("Removed " + role.name + " from moderator roles.");
                            } else {
                                message.reply("Role " + role.name + " isn't a moderator role.");
                            }
                        } else if (!role) {
                            message.reply("Can't find the role.");
                        }
                    } else if (cfgval == "adminrole" && params[1] && params[1] != "" && params[2] && params[2] != "") {
                        var role = message.mentions.roles.first() || message.guild.roles.find("name", params[2]);
                        var roleCfg = config.getData("/adminRoles");
                        if (role && params[1].toLowerCase() == "add") {
                            roleCfg.push(role.id);
                            config.push("/adminRoles", roleCfg, true);
                            message.reply("Added " + role.name + " to admin roles.");
                        } else if (role && params[1].toLowerCase() == "remove") {
                            var ind = roleCfg.indexOf(role.id);
                            if (ind > -1) {
                                roleCfg.splice(ind, 1);
                                config.push("/adminRoles", roleCfg, true);
                                message.reply("Removed " + role.name + " from admin roles.");
                            } else {
                                message.reply("Role " + role.name + " isn't an admin role.");
                            }
                        } else if (!role) {
                            message.reply("Can't find the role.");
                        }
                    } else if (cfgval == "modperms" && params[1] && params[1] != "" && params[2] && params[2] != "") {
                        var perms = config.getData("/modPerms");
                        var permission = params[2].toLowerCase();
                        var ind = perms.indexOf(permission);
                        if (permission != "ban" && permission != "kick" && permission != "messages" && permission != "roles") {
                            message.reply("Invalid permission \"" + permission + "\".");
                        } else {
                            if (params[1].toLowerCase() == "add") {
                                if (ind == -1) {
                                    perms.push(permission);
                                    config.push("/modPerms", perms, true);
                                    message.reply("Added \"" + permission + "\" to moderator permissions.");
                                } else {
                                    message.reply("Moderator already has " + permission + " permission.");
                                }
                            } else if (params[1].toLowerCase() == "remove") {
                                if (ind != -1) {
                                    perms.splice(ind, 1);
                                    config.push("/modPerms", perms, true);
                                    message.reply("Removed \"" + permission + "\" from moderator permissions.");
                                } else {
                                    message.reply("Moderator doesn't have " + permission + " permission.");
                                }
                            }
                        }
                    } else if (cfgval == "prefix" && params[1] && params[1] != "") {
                        if (params[1] == "reset" || params[1] == data.defPrefix) {
                            message.reply("Prefix was reset to **" + data.defPrefix + "**. :thumbsup:");
                            config.push("/prefix", "", true);
                        } else {
                            message.reply("Changing prefix to **" + params[1] + "**. **Note:** All commands will only use the new prefix.");
                            config.push("/prefix", params[1], true);
                        }
                    }
                }
            }
        } catch (e) {
            console.log("Error in setConfig: " + e.message);
        }
    }
}