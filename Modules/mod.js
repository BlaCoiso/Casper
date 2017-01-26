
// Module Docs___________________________
// | Name: Moderator
// | Type: MODULE
// | Function: Moderator commands
// |_____________________________________
var noPerms = "You don't have permissions to run this command";
module.exports = {
    handler: function (message, command, params, config, data) {
        if (this.handles.indexOf(command) != -1) {
            if (data.isDM) {
                message.reply(data.noDM);
            } else {
                if (command == "ban" || command == "banuser" || command == "userban") {
                    this.ban(message, params, config, data);
                } else if (command == "kick" || command == "kickuser" || command == "userkick") {
                    this.kick(message, params, config, data);
                } else if (command == "clear" || command == "purge" || command == "delete") {
                    this.clear(message, params, data);
                } else if (command == "unban" || command == "unbanuser") {
                    this.unban(message, params, config, data);
                } else if (command == "warn" || command == "warnuser") {
                    this.warn(message, params, config, data);
                } else if (command == "addrole" || command == "giverole" || command == "addr" || command == "giver") {
                    this.addrole(message, params, config, data);
                } else if (command = "removerole" || command == "takerole" || command == "remrole" || command == "rrole" || command == "taker") {
                    this.removerole(message, params, config, data);
                }
            }
        }
    },
    handles: ["ban", "warn", "banuser", "userban", "kick", "kickuser", "userkick", "clear", "purge", "delete", "unban", "unbanuser", "addrole", "giverole", "addr", "giver",
    "removerole", "takerole", "remrole", "rrole", "taker"],
    helpMessage: "**Moderator commands**:\n `ban`: Bans an user\n `unban`: Unbans an user.\n `kick`: Kicks an user.\n" +
        " `clear`: Clears messages.\n `addrole`: Adds a role to an user.\n `removerole`: Removes a role from an user.\n",
    help: function (command) {
        var helpVal = [];
        switch (command) {
            case "ban":
            case "banuser":
            case "userban":
                helpVal = ["Bans an user. Note that this command will fail if the user can't be banned by the bot or if the user's highest role is equal or higher than the moderator's highest role.", "{user} [reason]"];
                break;
            case "warn":
                helpVal = ["Warns an user.", "{user} [reason]"];
                break;
            case "kick":
            case "kickuser":
            case "userkick":
                helpVal = ["Kicks an user. Note that this command will fail if the user can't be kicked by the bot or if the user's highest role is equal or higher than the moderator's highest role.", "{user} [reason]"];
                break;
            case "clear":
            case "purge":
            case "delete":
                helpVal = ["Clears messages. Specify the number of messages from 1 to 99", "<amount>"];
                break;
            case "unban":
            case "unbanuser":
                helpVal = ["Unbans an user. Specify an username/ID/discriminator.", "{user} [reason]"];
                break;
            case "addrole":
            case "giverole":
            case "addr":
            case "giver":
                helpVal = ["Gives a role to an user. The role must be below the moderator and bot's highest role. Specify the role by name/ID/mention.", "{user} <role>"];
                break;
            case "removerole":
            case "takerole":
            case "remrole":
            case "rrole":
            case "taker":
                helpVal = ["Removes a role from an user. The role must be below the moderator and bot's highest role. Specify the role by name/ID/mention.", "{user} <role>"];
                break;
            default:
                helpVal = null;
                break;
        }
        return helpVal;
    },
    ban: function (message, params, config, data) {
        try {
            if (params.length == 0) {
                message.channel.sendMessage("`" + data.prefix + "ban`: Bans an user.\nUsage: `" + data.prefix + "ban {user} [reason]`");
            } else {
                if ((data.mod && data.modPerms.indexOf("ban") != -1) || data.admin || message.member.hasPermission("BAN_MEMBERS")) {
                    var userToBan = message.guild.member(message.mentions.users.first() || (params[0] && params[0] != "" ? data.userFind(data.client, message.guild, params[0]) : null));
                    if (userToBan) {
                        if (userToBan.bannable && userToBan.highestRole.comparePositionTo(message.guild.member(message.author).highestRole) < 0) {
                            var logCh = message.guild.channels.get(config.getData("/logChannel"));
                            logCh = logCh || message.channel;
                            var reason = params;
                            reason.shift();
                            reason = reason.join(" ");
                            var log = new data.Discord.RichEmbed()
                                .setAuthor(message.author.username + "#" + message.author.discriminator + " | " + message.author.id, message.author.avatarURL)
                                .setDescription("**Action:** Ban\n**User:** " + userToBan.user.username + "#" + userToBan.user.discriminator + " (" + userToBan.user.id + ")\n**Reason:** " + (reason && reason != "" ? reason : "No Reason"))
                                .setFooter("Casper Mod-Logs")
                                .setColor(16718080)
                                .setTimestamp();
                            logCh.sendEmbed(log);
                            if (logCh != message.channel) message.channel.sendMessage("Done.");
                            userToBan.ban();
                        } else {
                            message.channel.sendMessage("Can't ban **" + userToBan.user.username + "#" + userToBan.user.discriminator + "**");
                        }
                    } else {
                        message.channel.sendMessage("Can't find user.");
                    }
                } else {
                    message.reply(noPerms);
                }
            }
        } catch (e) {
            throw e;
        }
    },
    warn: function (message, params, config, data) {
        try {
            if (params.length == 0) {
                message.channel.sendMessage("`" + data.prefix + "warn`: Warns a user.\nUsage: `" + data.prefix + "warn {user} [reason]`");
            } else {
                if (data.mod) {
                    var userToWarn = message.guild.member(message.mentions.users.first() || (params[0] && params[0] != "" ? data.userFind(data.client, message.guild, params[0]) : null));
                    if (userToWarn) {
                        var logCh = message.guild.channels.get(config.getData("/logChannel"));
                        logCh = logCh || message.channel;
                        var reason = params;
                        reason.shift();
                        reason = reason.join(" ");
                        var log = new data.Discord.RichEmbed()
                            .setAuthor(message.author.username + "#" + message.author.discriminator + " | " + message.author.id, message.author.avatarURL)
                            .setDescription("**Action:** Warn\n**User:** " + userToWarn.user.username + "#" + userToWarn.user.discriminator + " (" + userToWarn.user.id + ")\n**Reason:** " + (reason && reason != "" ? reason : "No Reason"))
                            .setFooter("Casper Mod-Logs")
                            .setColor(16776960)
                            .setTimestamp();
                        logCh.sendEmbed(log);
                        if (logCh != message.channel) message.channel.sendMessage("Warned user " + userToWarn + ".");
                    } else {
                        message.channel.sendMessage("Can't find user.");
                    }
                }
            }
        } catch (e) {
            throw e;
        }
    },
    kick: function (message, params, config, data) {
        try {
            if (params.length == 0) {
                message.channel.sendMessage("`" + data.prefix + "kick`: Kicks a user.\nUsage: `" + data.prefix + "kick {user} [reason]`");
            } else {
                if ((data.mod && data.modPerms.indexOf("kick") != -1) || data.admin || message.member.hasPermission("KICK_MEMBERS")) {
                    var userToKick = message.guild.member(message.mentions.users.first() || (params[0] && params[0] != "" ? data.userFind(data.client, message.guild, params[0]) : null));
                    if (userToKick) {
                        if (userToKick.kickable && userToKick.highestRole.comparePositionTo(message.guild.member(message.author).highestRole) < 0) {
                            var logCh = message.guild.channels.get(config.getData("/logChannel"));
                            logCh = logCh || message.channel;
                            var reason = params;
                            reason.shift();
                            reason = reason.join(" ");
                            var log = new data.Discord.RichEmbed()
                                .setAuthor(message.author.username + "#" + message.author.discriminator + " | " + message.author.id, message.author.avatarURL)
                                .setDescription("**Action:** Kick\n**User:** " + userToKick.user.username + "#" + userToKick.user.discriminator + " (" + userToKick.user.id + ")\n**Reason:** " + (reason && reason != "" ? reason : "No Reason"))
                                .setFooter("Casper Mod-Logs")
                                .setColor(16745216)
                                .setTimestamp();
                            logCh.sendEmbed(log);
                            if (logCh != message.channel) message.channel.sendMessage("Done.")
                            userToKick.kick();
                        } else {
                            message.channel.sendMessage("Can't kick **" + userToKick.user.username + "#" + userToKick.user.discriminator + "**");
                        }
                    } else {
                        message.channel.sendMessage("Can't find user.");
                    }
                } else {
                    message.reply(noPerms);
                }
            }
        } catch (e) {
            throw e;
        }
    },
    unban: function (message, params, config, data) {
        try {
            if (params.length == 0) {
                message.channel.sendMessage("`" + data.prefix + "unban`: Unbans an user.\nUsage: `" + data.prefix + "unban (user ID, discriminator or username) [reason]`");
            } else if ((data.mod && data.modPerms.indexOf("ban") != -1) || data.admin || message.member.hasPermission("BAN_MEMBERS")) {
                var userToUnban = params[0];
                var logCh = message.guild.channels.get(config.getData("/logChannel"));
                logCh = logCh || message.channel;
                var reason = params;
                reason.shift();
                reason = reason.join(" ");
                message.guild.fetchBans().then(banlist => {
                    var toUnban = banlist.get(userToUnban) || banlist.find("discriminator", userToUnban) || banlist.find("username", userToUnban);
                    if (toUnban) {
                        message.guild.unban(toUnban);
                        var log = new data.Discord.RichEmbed()
                            .setAuthor(message.author.username + "#" + message.author.discriminator + " | " + message.author.id, message.author.avatarURL)
                            .setDescription("**Action:** Unban\n**User:** " + toUnban.username + "#" + toUnban.discriminator + " (" + toUnban.id + ")\n**Reason:** " + (reason && reason != "" ? reason : "No Reason"))
                            .setFooter("Casper Mod-Logs")
                            .setColor(8450847)
                            .setTimestamp();
                        logCh.sendEmbed(log);
                        if (logCh != message.channel) message.channel.sendMessage("Done.");
                    } else {
                        message.channel.sendMessage("Can't find user to unban.");
                    }
                })
            } else {
                message.reply(noPerms);
            }
        } catch (e) {
            throw e;
        }
    },
    clear: function (message, params, data) {
        try {
            if (params.length == 0) {
                message.channel.sendMessage("`" + data.prefix + "clear`: Clears messages.\nUsage: `" + data.prefix + "clear (Amount of messages)`");
            } else if ((data.mod && data.modPerms.indexOf("messages") != -1) || data.admin || message.member.hasPermission("MANAGE_MESSAGES")) {
                if (params.length == 1 && !isNaN(parseInt(params[0]))) {
                    var toDel = parseInt(params[0]);
                    if (toDel < 0) {
                        message.channel.sendMessage("Invalid clear amount.");
                    } else {
                        toDel = Math.min(toDel + 1, 100);
                        message.channel.bulkDelete(toDel);
                        message.channel.sendMessage("Deleted `" + toDel + "` Message(s) :thumbsup:").then(message => {
                            message.delete(5000);
                        });
                    }
                } else {
                    message.channel.sendMessage("Invalid clear amount.");
                }
            } else {
                message.reply(noPerms);
            }
        } catch (e) {
            throw e;
        }
    },
    addrole: function (message, params, config, data) {
        try {
            if (params.length < 2) {
                message.channel.sendMessage("`" + data.prefix + "addrole`: Gives a role to an user.\nUsage: `" + data.prefix + "addrole {user} (role mention / name / ID)`");
            } else {
                if ((data.mod && data.modPerms.indexOf("roles") != -1) || data.admin || message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
                    var user = message.guild.member(message.mentions.users.first() || (params[0] && params[0] != "" ? data.userFind(data.client, message.guild, params[0]) : null));
                    var role = params;
                    role = params.shift();
                    role = params.join(" ");
                    role = message.guild.roles.get(role) || message.guild.roles.find("name", role) || message.mentions.roles.first();
                    if (!user) {
                        message.channel.sendMessage("Can't find user.");
                    } else if (!role) {
                        message.channel.sendMessage("Can't find role.");
                    } else {
                        if (message.member.highestRole.comparePositionTo(role) > 0) {
                            user.addRole(role);
                            var logCh = message.guild.channels.get(config.getData("/logChannel"));
                            logCh = logCh || message.channel;
                            logCh.sendMessage("Role **" + role.name + "** was given to **" + user.user.username + "#" + user.user.discriminator + "** by **" + message.author.username + "#" + message.author.discriminator + "**.");
                            if (logCh != message.channel) {
                                message.channel.sendMessage("Done.");
                            }
                        }
                    }
                } else {
                    message.reply(noPerms);
                }
            }
        } catch (e) {
            throw e;
        }
    },
    removerole: function (message, params, config, data) {
        try {
            if (params.length < 2) {
                message.channel.sendMessage("`" + data.prefix + "removerole`: -Removes a role from an user.\nUsage: `" + data.prefix + "removerole {user} (role mention / name / ID)`");
            } else {
                if ((data.mod && data.modPerms.indexOf("roles") != -1) || data.admin || message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
                    var user = message.guild.member(message.mentions.users.first() || (params[0] && params[0] != "" ? data.userFind(data.client, message.guild, params[0]) : null));
                    var role = params;
                    role = params.shift();
                    role = params.join(" ");
                    role = message.guild.roles.get(role) || message.guild.roles.find("name", role) || message.mentions.roles.first();
                    if (!user) {
                        message.channel.sendMessage("Can't find user.");
                    } else if (!role) {
                        message.channel.sendMessage("Can't find role.");
                    } else {
                        if (message.member.highestRole.comparePositionTo(role) > 0) {
                            user.removeRole(role);
                            var logCh = message.guild.channels.get(config.getData("/logChannel"));
                            logCh = logCh || message.channel;
                            logCh.sendMessage("Role **" + role.name + "** was removed from **" + user.user.username + "#" + user.user.discriminator + "** by **" + message.author.username + "#" + message.author.discriminator + "**.");
                            if (logCh != message.channel) {
                                message.channel.sendMessage("Done.");
                            }
                        }
                    }
                } else {
                    message.reply(noPerms);
                }
            }
        } catch (e) {
            throw e;
        }
    }
}