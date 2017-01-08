
// Module Docs___________________________
// | Name: Moderator
// | Type: MODULE
// | Function: Moderator commands
// |_____________________________________

module.exports = {
    handler: function (message, command, params, config, data) {
        if (this.handles.indexOf(command) != -1) {
            if ((command == "ban" || command == "banuser" || command == "userban") && !data.isDM) {
                this.ban(message, params, config, data);
            } else if ((command == "kick" || command == "kickuser" || command == "userkick") && !data.isDM) {
                this.kick(message, params, config, data);
            } else if ((command == "clear" || command == "purge" || command == "delete") && !data.isDM) {
                this.clear(message, params, data);
            } else if ((command == "unban" || command == "unbanuser") && !data.isDM) {
                this.unban(message, params, config, data);
            } else if ((command == "warn" || command == "warnuser") && !data.isDM) {
                this.warn(message, params, config, data);
            } else if ((command == "addrole" || command == "giverole" || command == "addr" || command == "giver") && !data.isDM) {
                this.addrole(message, params, config, data);
            } else if (command = "removerole" || command == "takerole" || command == "remrole" || command == "rrole" || command == "taker") {
                this.removerole(message, params, config, data);
            }
        }
    },
    handles: ["ban", "warn", "banuser", "userban", "kick", "kickuser", "userkick", "clear", "purge", "delete", "unban", "unbanuser", "addrole", "giverole", "addr", "giver",
    "removerole", "takerole", "remrole", "rrole", "taker"],
    helpMessage: "**Moderator commands**:\n `ban`: Bans an user\n `unban`: Unbans an user.\n `kick`: Kicks an user.\n" +
        " `clear`: Clears messages.\n `addrole`: Adds a role to an user.\n `removerole`: Removes a role from an user.\n",
    ban: function (message, params, config, data, Discord, client) {
        if (params.length == 0) {
            message.channel.sendMessage("`" + data.prefix + "ban`: Bans an user.\nUsage: `" + data.prefix + "ban @user [reason]` or `" + data.prefix + "ban (nickname or ID) [reason]`");
        } else {
            if ((data.mod && data.modPerms.indexOf("ban") != -1) || data.admin) {
                var userToBan = message.guild.member(message.mentions.users.first()) || message.guild.members.get(params[0]) || message.guild.members.find("nickname", params[0]);
                if (userToBan) {
                    if (userToBan.bannable && userToBan.highestRole.comparePositionTo(message.guild.member(message.author).highestRole) < 0) {
                        var logCh = message.guild.channels.get(config.getData("/logChannel"));
                        logCh = logCh || message.channel;
                        var reason = params;
                        reason.shift();
                        reason = reason.join(" ");
                        logCh.sendMessage("**Action:** Ban\n**User:** " + userToBan.user.username + "#" + userToBan.user.discriminator + " | *" + userToBan.user.id + "*\n**Moderator:** " + message.author.username + "#" + message.author.discriminator + " | " + message.author.id + "\n**Reason:** " + (reason ? (reason) : "None"));
                        //logCh.sendMessage("User " + message.author.username + "#" + message.author.discriminator + " banned " + userToBan.user.username + "#" + userToBan.user.discriminator + (reason ? (" for " + reason) : ""));
                        if (logCh != message.channel) message.channel.sendMessage("Done.");
                        userToBan.ban();
                    } else {
                        message.channel.sendMessage("Can't ban **" + userToBan.user.username + "#" + userToBan.user.discriminator + "**");
                    }
                } else {
                    message.channel.sendMessage("Can't find user.");
                }
            }
        }
    },
    warn: function (message, params, config, data) {
        if (params.length == 0) {
            message.channel.sendMessage("`" + data.prefix + "warn`: Warns a user.\nUsage: `" + data.prefix + "warn @user [reason]` or `" + data.prefix + "warn (nickname or ID) [reason]`");
        } else {
            if (data.mod) {
                var userToWarn = message.guild.member(message.mentions.users.first() || message.guild.members.get(params[0]) || message.guild.members.find("nickname", params[0]));
                if (userToWarn) {
                    var logCh = message.guild.channels.get(config.getData("/logChannel"));
                    logCh = logCh || message.channel;
                    var reason = params;
                    reason.shift();
                    reason = reason.join(" ");
                    /*var log = new data.Discord.RichEmbed()
                      .setAuthor('Action: Ban')
                      .setColor(0x00AE86)
                      .setFooter('Moderator ID: ' + message.author.id + ' | ' + 'User ID: ' + userToWarn.user.id)
                      .addField('User', userToWarn.user.username + "#" + userToWarn.user.discriminator, true)
                      .addField('Moderator', message.author.username + "#" + message.author.discriminator, true)
                      .addField('Reason', reason);
                    logCh.sendEmbed(log);*///Embed issues with d.js 10 (?)
                    logCh.sendMessage("**Action:** Warn\n**User:** " + userToWarn.user.username + "#" + userToWarn.user.discriminator + " | *" + userToWarn.user.id + "*\n**Moderator:** " + message.author.username + "#" + message.author.discriminator + " | " + message.author.id + "\n**Reason:** " + (reason ? (reason) : "None"));
                    //logCh.sendMessage("User " + message.author.username + "#" + message.author.discriminator + " warned " + userToWarn.user.username + "#" + userToWarn.user.discriminator + (reason ? (" for " + reason) : ""));
                    if (logCh != message.channel) message.channel.sendMessage("Warned user.");
                } else {
                    message.channel.sendMessage("Can't find user.");
                }
            }
        }
    },
    kick: function (message, params, config, data) {
        if (params.length == 0) {
            message.channel.sendMessage("`" + data.prefix + "kick`: Kicks a user.\nUsage: `" + data.prefix + "kick @user [reason]` or `" + data.prefix + "kick (nickname or ID) [reason]`");
        } else {
            if ((data.mod && data.modPerms.indexOf("kick") != -1) || data.admin) {
                var userToKick = message.guild.member(message.mentions.users.first()) || message.guild.members.get(params[0]) || message.guild.members.find("nickname", params[0]);
                if (userToKick) {
                    if (userToKick.kickable && userToKick.highestRole.comparePositionTo(message.guild.member(message.author).highestRole) < 0) {
                        var logCh = message.guild.channels.get(config.getData("/logChannel"));
                        logCh = logCh || message.channel;
                        var reason = params;
                        reason.shift();
                        reason = reason.join(" ");
                        logCh.sendMessage("**Action:** Kick\n**User:** " + userToKick.user.username + "#" + userToKick.user.discriminator + " | *" + userToKick.user.id + "*\n**Moderator:** " + message.author.username + "#" + message.author.discriminator + " | " + message.author.id + "\n**Reason:** " + (reason ? (reason) : "None"))
                        //logCh.sendMessage("User " + message.author.username + " kicked " + userToKick.user.username + "#" + userToKick.user.discriminator + (reason ? (" for " + reason) : ""));
                        if (logCh != message.channel) message.channel.sendMessage("Done.")
                        userToKick.kick();
                    } else {
                        message.channel.sendMessage("Can't kick **" + userToKick.user.username + "#" + userToKick.user.discriminator + "**");
                    }
                } else {
                    message.channel.sendMessage("Can't find user.");
                }
            }
        }
    },
    unban: function (message, params, config, data) {
        if (params.length == 0) {
            message.channel.sendMessage("`" + data.prefix + "unban`: Unbans an user.\nUsage: `" + data.prefix + "unban (user ID, discriminator or username) [reason]`");
        } else if ((data.mod && data.modPerms.indexOf("ban") != -1) || data.admin) {
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
                    logCh.sendMessage("**Action:** Unban\n**User:** " + toUnban.username + "#" + toUnban.discriminator + " | " + toUnban.id + "\n**Moderator:** " + message.author.username + "#" + message.author.discriminator + " | " + message.author.id + "\n**Reason:** " + (reason ? (reason) : ""))
                    //logCh.sendMessage("User " + message.author + " unbanned " + toUnban.username + "#" + toUnban.discriminator + (reason ? (" for " + reason) : ""));
                    if (logCh != message.channel) message.channel.sendMessage("Done.");
                } else {
                    message.channel.sendMessage("Can't find user to unban.");
                }
            })
        }
    },
    clear: function (message, params, data) {
        if (params.length == 0) {
            message.channel.sendMessage("`" + data.prefix + "clear`: Clears messages.\nUsage: `" + data.prefix + "clear (Amount of messages)`");
        } else if (params.length == 1 && !isNaN(parseInt(params[0]))) {
            if ((data.mod && data.modPerms.indexOf("messages") != -1) || data.admin) {
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
            }
        } else {
            message.channel.sendMessage("Invalid clear amount.");
        }
    },
    addrole: function (message, params, config, data) {
        if (params.length < 2) {
            message.channel.sendMessage("`" + data.prefix + "addrole`: Gives a role to an user.\nUsage: `" + data.prefix + "addrole @user (role mention / name / ID)`");
        } else if (((data.mod && data.modPerms.indexOf("roles") != -1) || data.admin) && params.length >= 2) {
            var user = message.guild.member(message.mentions.users.first());//TODO: Find user in other ways
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
        }
    },
    removerole: function (message, params, config, data) {
        if (params.length < 2) {
            message.channel.sendMessage("`" + data.prefix + "removerole`: -Removes a role from an user.\nUsage: `" + data.prefix + "removerole @user (role mention / name / ID)`");
        } else if (((data.mod && data.modPerms.indexOf("roles") != -1) || data.admin) && params.length >= 2) {
            var user = message.guild.member(message.mentions.users.first());//TODO: Find user in other ways
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
        }
    }
}