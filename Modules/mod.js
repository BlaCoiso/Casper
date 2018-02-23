
// Module Docs___________________________
// | Name: Moderator
// | Type: CASPER_MODULE
// | Function: Moderation commands/features
// |_____________________________________

let mutes = {};

module.exports = {
    handles(event) { return ["message", "guild_init"].includes(event) },
    fullName: "Moderation",
    commands: [
        {
            name: "ban",
            description: "Bans a user.",
            perms: "ban",
            noPermsMessage: true,
            requiresArgs: true,
            aliases: ["banuser", "userban"],
            usage: "<user>",
            run(msg, args) {
                if (args.botPerms.has("BAN_MEMBERS")) {
                    let user = args.utils.userFind(msg.client, msg.guild, args.paramsJoined) || msg.mentions.users.first();
                    if (user) {
                        let userMember = msg.guild.member(user);
                        let modLogChannel = msg.guild.channels.get(args.moduleConf.logChannel);
                        if (userMember) {
                            if (userMember.bannable && userMember.highestRole.comparePositionTo(msg.member.highestRole) < 0) {
                                userMember.ban().then(m => {
                                    args.asyncCallback({ text: `Banned **${userMember.user.username + "#" + userMember.user.discriminator}**.` });
                                    if (modLogChannel) logAction(modLogChannel,
                                        { type: "ban", user: user, moderator: msg.author },
                                        args.setModuleConfig, args.config, args.moduleHandler.errorLog);
                                }).catch(e => {
                                    args.asyncCallback({ text: "Failed to ban user." });
                                    args.moduleHandler.errorLog(`${e.name} while banning user: ${e.message}`);
                                });
                            } else {
                                return { text: `**${user.username + "#" + user.discriminator}** can't be banned.` };
                            }
                        } else {
                            msg.guild.ban(user).then(u => {
                                args.asyncCallback({ text: `Banned **${user.username + "#" + user.discriminator}**.` });
                                if (modLogChannel) logAction(modLogChannel,
                                    { type: "ban", user: user, moderator: msg.author },
                                    args.setModuleConfig, args.config, args.moduleHandler.errorLog);
                            }).catch(e => {
                                args.asyncCallback({ text: "Failed to ban user." });
                                args.moduleHandler.errorLog(`${e.name} while banning user: ${e.message}`);
                            });
                        }
                    } else {
                        return { text: "Can't find user to ban." };
                    }
                } else {
                    return { text: "I don't have permission to ban users." };
                }
            }
        },
        {
            name: "unban",
            description: "Unbans a user.",
            usage: "<user>",
            perms: "ban",
            aliases: "unbanuser",
            noPermsMessage: true,
            requiresArgs: true,
            run(msg, args) {
                if (!args.botPerms.has("BAN_MEMBERS")) return { text: "I don't have permissions to ban/unban." };
                msg.guild.fetchBans().then(list => {
                    let userToUnban = list.get(args.params[0]) || list.find(user => user.username.toLowerCase() + user.discriminator == args.params.join(" ")) || list.find(user => user.username.toLowerCase() == args.params.join(" "));
                    if (userToUnban) {
                        msg.guild.unban(userToUnban).then(user => {
                            args.asyncCallback({ text: `Unbanned **${user.username + "#" + user.discriminator}**.` });
                            let modLogChannel = msg.guild.channels.get(args.moduleConf.logChannel);
                            if (modLogChannel) logAction(modLogChannel,
                                { type: "unban", user: userToUnban, moderator: msg.author },
                                args.setModuleConfig, args.config, args.moduleHandler.errorLog);
                        }).catch(e => {
                            args.asyncCallback({ text: "Failed to unban user." });
                            args.moduleHandler.errorLog(`${e.name} while unbanning user: ${e.message}`);
                        });
                    } else {
                        args.asyncCallback({ text: "Can't find user to unban." });
                    }
                })
            }
        },
        {
            name: "kick",
            description: "Kicks a user.",
            perms: "kick",
            noPermsMessage: true,
            requiresArgs: true,
            aliases: ["kickuser", "userkick"],
            usage: "<user>",
            run(msg, args) {
                if (args.botPerms.has("KICK_MEMBERS")) {
                    let user = args.utils.userFind(msg.client, msg.guild, args.paramsJoined) || msg.mentions.users.first();
                    if (user) {
                        let userMember = msg.guild.member(user);
                        if (userMember) {
                            if (userMember.kickable && userMember.highestRole.comparePositionTo(msg.member.highestRole) < 0) {
                                let modLogChannel = msg.guild.channels.get(args.moduleConf.logChannel);
                                userMember.kick().then(m => {
                                    args.asyncCallback({ text: `Kicked **${userMember.user.username + "#" + userMember.user.discriminator}**.` });
                                    if (modLogChannel) logAction(modLogChannel,
                                        { type: "kick", user: user, moderator: msg.author },
                                        args.setModuleConfig, args.config, args.moduleHandler.errorLog);
                                }).catch(e => {
                                    args.asyncCallback({ text: "Failed to kick user." });
                                    args.moduleHandler.errorLog(`${e.name} while kicking user: ${e.message}`);
                                });
                            } else {
                                return { text: `**${user.username + "#" + user.discriminator}** can't be kicked.` };
                            }
                        } else {
                            return { text: "Can't find user to kick in this server." };
                        }
                    } else {
                        return { text: "Can't find user to kick." };
                    }
                } else {
                    return { text: "I don't have permission to kick users." };
                }
            }
        },
        {
            name: "mute",
            description: "Mutes a user. The user can be muted for a specific amount of time.",
            perms: "mod",
            noPermsMessage: true,
            requiresArgs: true,
            usage: "<user> [length]",
            run(msg, args) {
                if (args.params[0] && args.params[0] != "") { //tf
                    let time = args.utils.parseTimeString(args.params[args.params.length - 1]) * 1000;
                    let user = (time == 0 ? args.utils.userFind(msg.client, msg.guild, args.paramsJoined) : null) ||
                        args.utils.userFind(msg.client, msg.guild, args.params.slice(0, args.params.length - 1).join(" ")) ||
                        msg.mentions.users.first();
                    let userMember = msg.guild.member(user);
                    let timestamp = (args.params[1] && args.params[1] != "") ? Date.now() + (time) : null;
                    let muteRole = msg.guild.roles.get(args.moduleConf.mutedRole);
                    let rolePerms = args.botPerms.has("MANAGE_ROLES");
                    if (!muteRole) {
                        if (rolePerms) {
                            makeMuteRole(msg.guild, msg.guild.member(msg.client.user), function (role) { args.setModuleConfig(args.config, "Mod", "mutedRole", role.id); });
                            return { text: "**Created __CasperMuted__ role**. Please move the role upwards and check permissions." };
                        } else {
                            return { text: "I don't have permission to create the mute role." };
                        }
                    } else {
                        if (time && time < 5000) {
                            return { text: "Mute is too short, minimum is 5 seconds." };
                        } else if (!rolePerms) {
                            return { text: "I don't have permissions to give roles / manage channel permissions." };
                        } else if (userMember && user != msg.client.user) {
                            let muteInfo = { user: user.id, timestamp: timestamp };
                            let muteList = args.moduleConf.mutes;
                            if (muteList && muteRole) {
                                if (!mutes[msg.guild.id]) mutes[msg.guild.id] = {};
                                let index = -1;
                                let alreadyMuted = false;
                                let logChannel = msg.guild.channels.get(args.moduleConf.logChannel);
                                for (let muteObject of muteList) {
                                    if (muteObject.user == muteInfo.user) {
                                        index = muteList.indexOf(muteObject);
                                        break;
                                    }
                                }
                                if (index == -1) {
                                    muteList.push(muteInfo);
                                } else {
                                    muteList[index] = muteInfo;
                                    alreadyMuted = true;
                                }
                                if (timestamp) {
                                    if (!mutes[msg.guild.id]) mutes[msg.guild.id] = [];
                                    let delay = timestamp - Date.now();
                                    if (mutes[msg.guild.id][user.id]) clearTimeout(mutes[msg.guild.id][user.id]);
                                    mutes[msg.guild.id][user.id] = setTimeout(unmuteUser, delay, userMember, muteRole, args.moduleHandler.errorLog, muteList, muteInfo, args.config);
                                }
                                args.setModuleConfig(args.config, "Mod", "mutes", muteList);
                                if (logChannel) logAction(logChannel,
                                    { type: "mute", user: user, moderator: msg.author, mute: time ? args.utils.getTime(time / 1000) : null },
                                    args.setModuleConfig, args.config, args.moduleHandler.errorLog);
                                userMember.addRole(muteRole).catch(e => {
                                    args.moduleHandler.errorLog(`${e.name} while trying to mute user: ${e.message}`);
                                    args.asyncCallback("Failed to mute user.");
                                });
                                return { text: (alreadyMuted) ? `**${user.username + "#" + user.discriminator}** was already muted, resetting mute timer.` : `Muted **${user.username + "#" + user.discriminator}**.` };
                            }
                        } else if (!userMember) return { text: "Can't find user to mute." };
                        else if (user == msg.client.user) return { text: "I can't be muted." };
                    }
                }
            }
        },
        {
            name: "mutes",
            description: "Lists muted users.",
            aliases: ["mutelist", "listmute", "listmutes"],
            run(msg, args) {
                let output = "**List of mutes**: \n";
                let muteList = args.moduleConf.mutes;
                if (muteList.length == 0) {
                    return { text: "No users are muted." };
                } else {
                    for (let mute of muteList) {
                        user = msg.client.users.get(mute.user);
                        output += ` User: **${user.username + "#" + user.discriminator}**${mute.timestamp ? ", muted for " + args.utils.getTime((mute.timestamp - Date.now()) / 1000) : ""}\n`;
                    }
                    return { text: output };
                }
            }
        },
        {
            name: "unmute",
            description: "Unmutes a user.",
            perms: "mod",
            noPermsMessage: true,
            requiresArgs: true,
            usage: "<user>",
            run(msg, args) {
                let muteList = args.moduleConf.mutes;
                let user = args.utils.userFind(msg.client, msg.guild, args.paramsJoined) || msg.mentions.users.first();
                let userMember = msg.guild.member(user);
                let muteRole = msg.guild.roles.get(args.moduleConf.mutedRole);
                let unmuted = false;
                if (!muteRole) return { text: "Can't find muted role." };
                if (user) {
                    if (userMember) {
                        for (let muteObj of muteList) {
                            if (muteObj.user == user.id) {
                                if (mutes[msg.guild.id] && mutes[msg.guild.id][user.id]) {
                                    clearTimeout(mutes[msg.guild.id][user.id]);
                                    mutes[msg.guild.id][user.id] = null;
                                }
                                unmuteUser(userMember, muteRole, args.moduleHandler.errorLog, muteList, muteObj, args.config);
                                unmuted = true;
                                break;
                            }
                        }
                        return { text: (unmuted ? `Unmuted **${user.username + "#" + user.discriminator}**.` : `**${user.username + "#" + user.discriminator}** isn't muted.`) }
                    } else {
                        return { text: "User to be unmuted isn't on this server." };
                    }
                } else {
                    return { text: "Can't find user to unmute." };
                }

            }
        },
        {
            name: "modlog",
            description: "Sets a channel to log moderation actions.",
            perms: "mod",
            noPermsMessage: true,
            aliases: ["setmodlog", "setactionlog", "actionlog"],
            usage: "<channel>|reset",
            run(msg, args) {
                if (args.params.length == 0) {
                    let logChannel = msg.guild.channels.get(args.moduleConf.logChannel);
                    return {
                        text: `\`${args.prefix + args.command}\`: ${this.description}\n Current channel: ${logChannel ? logChannel : "None"}`
                    };
                } else {
                    let channels = msg.guild.channels;
                    let channel = channels.get(args.paramsJoined) || channels.find("name", args.paramsJoined) || msg.mentions.channels.first();
                    if (channel) {
                        args.setModuleConfig(args.config, "Mod", "logChannel", channel.id);
                        return { text: `Set moderation log channel to ${channel}.` };
                    } else if (args.paramsJoined == "reset" || args.paramsJoined == "remove") {
                        args.setModuleConfig(args.config, "Mod", "logChannel", "");
                        return { text: `Reset moderation log channel.` };
                    } else {
                        return { text: "Can't find the channel." };
                    }
                }
            }
        },
        {
            name: "addrole",
            description: "Gives a role to a user.",
            perms: "roles",
            aliases: ["giverole", "roleadd"],
            usage: "<user> <role>",
            noPermsMessage: true,
            requiresArgs: true,
            run(msg, args) {
                let paramsParsed = args.utils.parseQuotes(args.params);
                let roleAndUser = args.utils.getUserRole(msg.guild, paramsParsed, msg.client);
                if (roleAndUser && roleAndUser.length != 0) {
                    let user = roleAndUser[0] || msg.mentions.users.first();
                    let role = roleAndUser[1] || msg.mentions.roles.first();
                    if (!user) return { text: "Can't find user." };
                    if (!role) return { text: "Can't find role." };
                    user = msg.guild.member(user);
                    if (!user) return { text: "User found is not in server." };
                    if (!args.botPerms.has("MANAGE_ROLES")) return { text: "I can't give roles." };
                    if (msg.member.highestRole.comparePositionTo(role) > 0) {
                        if (msg.guild.member(msg.client.user).highestRole.comparePositionTo(role) > 0) {
                            user.addRole(role).then(r => {
                                args.asyncCallback({ text: `Role **${role.name}** was given to **${user.user.username + "#" + user.user.discriminator}**.` });
                                logChannel = msg.guild.channels.get(args.moduleConf.logChannel);
                                if (logChannel) logChannel.send(`Role **${role.name}** was given to **${user.user.username + "#" + user.user.discriminator}** by **${msg.author.username + "#" + msg.author.discriminator}**.`).catch(args.errLogger);
                            }).catch(e => {
                                args.asyncCallback({ text: "Failed to give role." });
                                args.errLogger(e.name + " on addRole: " + e.message);
                            })
                        } else {
                            return { text: "I can't give this role." };
                        }
                    } else {
                        return { text: "You can't give this role." };
                    }
                } else {
                    return { text: "Can't find role or user." };

                }
            }
        },
        {
            name: "removerole",
            description: "Removes a role from a user.",
            perms: "roles",
            aliases: ["rrole", "remrole", "takerole"],
            usage: "<user> <role>",
            requiresArgs: true,
            noPermsMessage: true,
            run(msg, args) {
                {
                    let paramsParsed = args.utils.parseQuotes(args.params);
                    let roleAndUser = args.utils.getUserRole(msg.guild, paramsParsed, msg.client);
                    if (roleAndUser && roleAndUser.length != 0) {
                        let user = roleAndUser[0] || msg.mentions.users.first();
                        let role = roleAndUser[1] || msg.mentions.roles.first();
                        if (!user) return { text: "Can't find user." };
                        if (!role) return { text: "Can't find role." };
                        user = msg.guild.member(user);
                        if (!user) return { text: "User found is not in server." };
                        if (!args.botPerms.has("MANAGE_ROLES")) return { text: "I can't give/remove roles." };
                        if (msg.member.highestRole.comparePositionTo(role) > 0) {
                            if (msg.guild.member(msg.client.user).highestRole.comparePositionTo(role) > 0) {
                                user.removeRole(role).then(r => {
                                    args.asyncCallback({ text: `Role **${role.name}** was taken from **${user.user.username + "#" + user.user.discriminator}**.` });
                                    logChannel = msg.guild.channels.get(args.moduleConf.logChannel);
                                    if (logChannel) logChannel.send(`Role **${role.name}** was taken from **${user.user.username + "#" + user.user.discriminator}** by **${msg.author.username + "#" + msg.author.discriminator}**.`).catch(args.errLogger);
                                }).catch(e => {
                                    args.asyncCallback({ text: "Failed to remove role." });
                                    args.errLogger(e.name + " on removeRole: " + e.message);
                                })
                            } else {
                                return { text: "I can't take this role." };
                            }
                        } else {
                            return { text: "You can't take this role." };
                        }
                    } else {
                        return { text: "Can't find role or user." };
                    }
                }
            }
        },
        {
            name: "clear",
            description: "Clears up to 100 messages.",
            aliases: ["delete", "purge"],
            perms: "messages",
            noPermsMessage: true,
            requiresArgs: true,
            usage: "<count>",
            run(msg, args) {
                if (args.channelPerms.has("MANAGE_MESSAGES") && args.channelPerms.has("READ_MESSAGE_HISTORY")) {
                    let deleteCount = parseInt(args.params[0]);
                    if (deleteCount && deleteCount > 0 && !isNaN(deleteCount)) {
                        msg.channel.bulkDelete(Math.min(deleteCount + 1, 100), true).then(m => {
                            args.asyncCallback({ text: `Deleted ${Math.max(m.size - 1, 0)} message${m.size == 2 ? "" : "s"}. :thumbsup:` }).then(m => m.delete(5000));
                        }).catch(e => {
                            args.asyncCallback({ text: "Failed to clear messages." });
                            args.moduleHandler.errorLog(`${e.name} while clearing messages: ${e.message}`);
                        });
                    }
                } else {
                    return { text: "I don't have permissions to delete messages or read message history." };
                }
            }
        },
        {
            name: "reason",
            description: "Sets a reason for the last moderation action.",
            perms: "mod",
            noPermsMessage: true,
            requiresArgs: true,
            usage: "<reason>",
            run(msg, args) {
                let lastModCase = args.moduleConf.lastModCase;
                if (lastModCase) {
                    lastModCase.data.reason = args.paramsJoined;
                    let channel = msg.guild.channels.get(lastModCase.channel);
                    if (channel) {
                        channel.fetchMessage(lastModCase.message).then(m => {
                            let caseArgs = Object.assign({ message: m }, lastModCase.data)
                            caseArgs.user = m.client.users.get(lastModCase.data.user);
                            caseArgs.moderator = m.client.users.get(lastModCase.data.moderator);
                            logAction(channel, caseArgs, args.setModuleConfig, args.config, args.moduleHandler.errorLog);
                            args.asyncCallback({ text: `Set the last moderation case reason to "${args.paramsJoined}"` });
                        }).catch(args.moduleHandler.errorLog);
                    }
                }
            }
        }
    ],
    needsConfig: true,
    confV: 2,
    generateConfig(oldConf, guild) {
        let muteRole = oldConf.mutedRole;
        if (!(muteRole && muteRole != "" && guild.roles.get(muteRole))) {
            let role = guild.roles.find(role => { return role.name.toLowerCase() == "caspermuted" }) || guild.roles.find(role => { return role.name.toLowerCase().includes("muted") });
            if (role) muteRole = role.id;
        }
        oldConf.mutedRole = muteRole || "";
        oldConf.mutes = oldConf.mutes || [];
        oldConf.lastModCase = oldConf.lastModCase || {};
        oldConf.logChannel = oldConf.logChannel || "";
        oldConf.version = this.confV;
        return oldConf;
    },
    checkConfUpdates(oldConfig) {
        return oldConfig.version != this.confV;
    },
    handle(eventType, eventArgs, Discord, Client, Config) {
        if (eventType == "guild_init" && eventArgs.moduleConfig) {
            let muteList = eventArgs.moduleConfig.mutes;
            let muteRole = eventArgs.moduleConfig.mutedRole;
            let guild = eventArgs.guild;
            if (!(muteRole && guild.roles.get(muteRole))) {
                let role = guild.roles.find(role => { return role.name.toLowerCase() == "caspermuted" }) || guild.roles.find(role => { return role.name.toLowerCase().includes("muted") });
                if (role) {
                    muteRole = role.id;
                } else {
                    muteRole = "";
                }
                eventArgs.config.saveValue("moduleData.Mod.mutedRole", muteRole);
            }
            if (muteList && muteList.length != 0) {
                muteRole = guild.roles.get(muteRole);
                if (muteRole) {
                    for (let mute of muteList) {
                        if (mute.timestamp) {
                            let delay = mute.timestamp - Date.now();
                            let user = guild.members.get(mute.user);
                            if (user) {
                                if (delay < 5) {
                                    unmuteUser(user, muteRole, eventArgs.errLogger, muteList, mute, eventArgs.config);
                                } else {
                                    if (!mutes[guild.id]) mutes[guild.id] = [];
                                    if (mutes[guild.id][user.id]) clearTimeout(mutes[guild.id][user.id]);
                                    mutes[guild.id][user.id] = setTimeout(unmuteUser, delay, user, muteRole, eventArgs.errLogger, mutes, mute, eventArgs.config);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

function unmuteUser(gMember, role, logger, muteList, mute, config) {
    gMember.removeRole(role)
        .then(m => { console.log(`[MOD:Mod]: Unmuted user ${m.user.username + "#" + m.user.discriminator}, timestamp ${mute.timestamp}.`) })
        .catch(e => { logger(`${e.name} while unmuting user ${gMember.user.username + "#" + gMember.user.discriminator}: ${e.message}`) });
    muteList.splice(muteList.indexOf(mute));
    config.saveValue("moduleData.Mod.mutes", muteList);
}

function makeMuteRole(guild, botMember, callback) {
    guild.createRole({ name: "CasperMuted", color: 1, permissions: 0 }).then(r => {
        guild.channels.forEach(channel => {
            if (channel && channel.permissionsFor(botMember).has("MANAGE_ROLES")) channel.overwritePermissions(r, { SEND_MESSAGES: false, ATTACH_FILES: false });
        });
        callback(r);
    }).catch(e => console.error("[MOD:Mod]: Can't create mute role for some reason; " + e.name + ": " + e.message));
}

function logAction(channel, actionData, configSet, config, errorLog) {
    try {
        if (actionData) {
            let saveData = Object.assign({}, actionData);
            saveData.user = actionData.user.id;
            saveData.moderator = actionData.moderator.id;
            if (saveData.message) saveData.message = null;
            let logger = (actionData.message ? actionData.message.edit.bind(actionData.message) : channel.send.bind(channel));
            switch (actionData.type) {
                case "ban":
                case "kick":
                case "unban":
                    logger(`**${actionData.user.username + "#" + actionData.user.discriminator}** was **${actionData.type == "kick" ? "kicked" : (actionData.type == "ban" ? "banned" : "unbanned")}**` +
                        ` by **${actionData.moderator.username + "#" + actionData.moderator.discriminator}**${actionData.reason ? ` for "${actionData.reason}"` : ""}.`)
                        .catch(errorLog)
                        .then(m => configSet(config, "Mod", "lastModCase", {
                            message: m.id, channel: channel.id, data: saveData
                        }));
                    break;
                case "mute":
                    logger(`**${actionData.user.username + "#" + actionData.user.discriminator}** was muted${actionData.mute ? ` for **${actionData.mute}**` : ""}` +
                        ` by **${actionData.moderator.username + "#" + actionData.moderator.discriminator}**${actionData.reason ? ` for "${actionData.reason}"` : ""}.`)
                        .catch(errorLog)
                        .then(m => configSet(config, "Mod", "lastModCase", {
                            message: m.id, channel: channel.id, data: saveData
                        }));
                    break;
                default:
                    logger(`**Action**: ${actionData.type}\n**User**:${actionData.user.username + "#" + actionData.user.discriminator}\n**Moderator**: ${actionData.moderator.username + "#" + actionData.moderator.discriminator}${actionData.reason ? `\n**Reason**: "${actionData.reason}"` : ""}.`)
                        .catch(errorLog)
                        .then(m => configSet(config, "Mod", "lastModCase", {
                            message: m.id, channel: channel.id, data: saveData
                        }));
                    break;
            }
        }
    } catch (e) {
        errorLog(e.name + " while logging " + actionData.type + " action: " + e.message);
    }
}