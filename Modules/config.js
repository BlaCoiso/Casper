
// Module Docs___________________________
// | Name: Config
// | Type: MODULE
// | Function: Manage bot configuration
// |_____________________________________

module.exports = {
    handler: function (message, command, params, config, data) {
        try {
            if (this.handles.indexOf(command) != -1) {
                if (command == "autoconfig" || command == "autoconf") {
                    this.autoConfig(message, data, config);
                } else if (command == "config" || command == "configset" || command == "botconfig" || command == "setconf") {
                    this.setConfig(message, params, config, data);
                }
            }
        } catch (e) {
            throw e;
        }
    },
    handles: ["autoconf", "autoconfig", "config", "configset", "botconfig", "setconf"],
    helpMessage: "**Configuration commands**:\n `autoconfig`: Automatically detects config.\n" +
        " `config`: Changes the config for the server, will only work after running `autoconfig`, only works if you have admin permissions.\n",
    help: function (command) {
        var helpVal = [];
        switch (command) {
            case "autoconf":
            case "autoconfig":
                helpVal = ["Automatically detects config for the server. This command can only run once.", ""];
                break;
            case "config":
            case "configset":
            case "setconf":
            case "botconfig":
                helpVal = ["Changes config for the server. For a list of options, run the command", "<option1> [option2] [option3]"];
                break;
            default:
                helpVal = null;
                break;
        }
        return helpVal;
    },
    autoConfig: function (message, data, config) {
        try {
            if (data.isDM) {
                message.reply(data.noDM);
            } else if (!config.getData("/autoConf")) {
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
                var serverRoles = message.guild.roles.values();
                var adminRoles = [];
                var modRoles = [];
                var adminNames = [];
                var modNames = [];
                for (var role of serverRoles) {
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
                message.reply(send + "\n\nFound config: \nMod roles: " + modNames.toString() + "\nAdmin roles: " + adminNames.toString() + "\nTo change the config, do the command `" + data.prefix + "config`." + (adminNames.length == 0 ? "\n**Error**: No admin roles found. Not saving config (make sure there's a role with admin permissions." : ""));
                try {
                    if (!adminRoles.length == 0) {
                        config.push("/modRoles", modRoles, true);
                        config.push("/adminRoles", adminRoles, true);
                        config.push("/autoConf", true, true);
                    }
                } catch (e) {
                    throw (e);
                }
            } else {
                message.reply("Config was already generated. To change it, use the `" + data.prefix + "config` command.");
            }
        } catch (e) {
            throw e;
        }
    },
    setConfig: function (message, params, config, data) {
        try {
            if (!data.isDM && (data.admin || data.isDev) && config.getData("/autoConf")) {
                var configFix = confCheck(message.guild, config);
                if (params.length == 0) {
                    var out = "Server config manager (unfinished)\n**List of available options**:\n";
                    out += "*action-log*: Select a channel to log moderator actions\n";
                    out += "*join-channel*: Select a channel to log when user joins/leaves\n";//Unimplemented
                    out += "*modrole*: Selects roles with moderator permissions\n";
                    out += "*adminrole*: Selects roles with admin permissions (**WARNING: Gives access to config**)\n";
                    out += "*modperms*: Selects permissions of moderators\n";
                    out += "*prefix*: Selects a new prefix for the bot\n";
                    out += "*list*: Lists current config"
                    if (configFix) out += "\n**Note**: There were issues with the config, it got changed.";
                    message.channel.sendMessage(out);
                } else if (params.length == 1) {
                    var cfgval = params[0].toLowerCase();
                    if (cfgval == "action-log" || cfgval == "actionlog" || cfgval == "mod-log" || cfgval == "modlog") {
                        message.channel.sendMessage("*" + cfgval + "*: Sets a channel to log moderator actions. Use \"reset\n to stop logging and mention a channel or put the channel name after it.");
                    } else if (cfgval == "modrole" || cfgval == "modroles") {
                        message.channel.sendMessage("*modrole*: Sets a role with moderator permissions.\nUse \"add\" to add a role and \"remove\" to remove a role and put the role name after it.");
                    } else if (cfgval == "adminrole" || cfgval == "adminroles") {
                        message.channel.sendMessage("*adminrole*: Sets a role with admin permissions. (Can use config)\nUse add to add a role and remove to remove a role and put the role name after it.");
                    } else if (cfgval == "modperms") {
                        message.channel.sendMessage("*modperms*: Sets permissions of moderators.\nUse add or remove to add permissions.\n**List of permissions**: *Ban*, *Kick*, *Messages*, *Roles*\nYou can also use *all* to add all permissions.");
                    } else if (cfgval == "prefix") {
                        message.channel.sendMessage("*prefix*: Sets a new prefix for the bot on the current server.\nUse \"reset\" to reset the prefix.");
                    } else if (cfgval == "list" || cfgval == "show") {
                        var confList = "**Action log channel**: " + (message.guild.channels.get(config.getData("/logChannel")) ? message.guild.channels.get(config.getData("/logChannel")) : "None");
                        confList += "\n**Moderator roles**: ";
                        var modRoles = [];
                        var roleList = config.getData("/modRoles");
                        for (var i = 0; i < roleList.length; ++i) {
                            modRoles.push(message.guild.roles.get(roleList[i]).name);
                        }
                        confList += modRoles.join(", ");
                        confList += "\n**Moderator permissions**: " + config.getData("/modPerms").join(", ");
                        confList += "\n**Admin roles**: ";
                        var adminRoles = [];
                        roleList = config.getData("/adminRoles");
                        for (var i = 0; i < roleList.length; ++i) {
                            adminRoles.push(message.guild.roles.get(roleList[i]).name);
                        }
                        confList += adminRoles.join(", ");
                        confList += "\n**Prefix**: " + data.prefix;
                        confList += "\n**Config Version**: " + config.getData("/confver");
                        if (configFix) confList += "\nNote: There were issues with the config and it got changed.";
                        message.channel.sendMessage("__**Config list**__:\n" + confList);
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
                    } else if ((cfgval == "modrole" || cfgval == "modroles") && params[1] && params[1] != "" && params[2] && params[2] != "" && data.admin) {
                        var role = message.mentions.roles.first() || message.guild.roles.find("name", params.splice(2).join(" "));
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
                    } else if ((cfgval == "adminrole" || cfgval == "adminroles") && params[1] && params[1] != "" && params[2] && params[2] != "" && data.admin) {
                        var role = message.mentions.roles.first() || message.guild.roles.find("name", params.splice(2).join(" "));
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
                    } else if (cfgval == "modperms" && params[1] && params[1] != "" && params[2] && params[2] != "" && data.admin) {
                        var perms = config.getData("/modPerms");
                        var permission = params[2].toLowerCase();
                        var ind = perms.indexOf(permission);
                        if (permission != "ban" && permission != "kick" && permission != "messages" && permission != "roles" && permission != "all") {
                            message.reply("Invalid permission \"" + permission + "\".");
                        } else {
                            if (params[1].toLowerCase() == "add") {
                                if (ind == -1) {
                                    if (permission == "all") {
                                        perms = ["ban", "kick", "messages", "roles"];
                                        config.push("/modPerms", perms, true);
                                        message.reply("Added all permissions to moderator permissions.");
                                    } else {
                                        perms.push(permission);
                                        config.push("/modPerms", perms, true);
                                        message.reply("Added \"" + permission + "\" to moderator permissions.");
                                    }
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
            } else if (data.isDM) {
                message.reply(data.noDM);
            } else if (!config.getData("/autoConf")) {
                message.reply("Config hasn't been generated, please run `" + data.prefix + "autoConfig` then try again.");
            } else if (data.admin || data.isDev) {
                message.reply("You don't have permissions to run this command");
            }
        } catch (e) {
            throw e;
        }
    }
}

function confCheck(guild, conf) {
    try {
        var val = conf.getData("/logChannel");
        var changed = false;
        if (val && val != "") {
            var ch = guild.channels.get(val);
            if (!ch) {
                changed = true;
                conf.push("/logChannel", "", true);
            }
        }
        val = conf.getData("/modRoles");
        var updated = false;
        var newVal = val;
        if (val && val.length != 0) {
            for (var i = 0; i < val.length; ++i) {
                var role = guild.roles.get(val[i]);
                if (!role) {
                    changed = true;
                    updated = true;
                    newVal.splice(newVal.indexOf(val[i]), 1);
                }
            }
            if (updated) conf.push("/modRoles", newVal, true);
            updated = false;
        }
        val = conf.getData("/adminRoles");
        var newVal = val;
        if (val && val.length != 0) {
            for (var i = 0; i < val.length; ++i) {
                var role = guild.roles.get(val[i]);
                if (!role) {
                    changed = true;
                    updated = true;
                    newVal.splice(newVal.indexOf(val[i]), 1);
                }
            }
            if (updated) {
                conf.push("/adminRoles", newVal, true);
            }
        }
        if (newVal.length == 0) {
            config.push("/autoConf", false, true);
        }
        return changed;
    } catch (e) {
        throw e;
    }
}