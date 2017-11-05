
// Module Docs___________________________
// | Name: Config
// | Type: CASPER_MODULE
// | Function: Config manager commands
// |_____________________________________

module.exports = {
    handles(event) {
        return ["message", "guild_init"].includes(event);
    },
    commands: [
        {
            name: "config",
            description: "Changes config for the server.",
            perms: ["admin"],
            aliases: ["setconfig", "configset", "botconfig", "cfg"],
            noPermsMessage: true,
            run(msg, args) {
                if (args.params[0] == "modrole" || args.params[0] == "modroles") {
                    let roleName = args.params.slice(2).join(" ");
                    let role = args.utils.roleFind(msg.guild, roleName);
                    let modRoles = args.config.readValue("modRoles");
                    let notFound = false;
                    if (args.params[1] == "add") {
                        if (role) {
                            if (modRoles.includes(role.id)) {
                                return { text: "Role is already in the list!" };
                            } else {
                                modRoles.push(role.id);
                                args.config.saveValue("modRoles", modRoles);
                                return { text: `Added **${role.name}** to the moderator roles.` };
                            }
                        } else if (roleName == "") {
                            return { text: "Please specify a role to add." };
                        }
                        else notFound = true;
                    } else if (args.params[1] == "remove") {
                        if (role) {
                            if (modRoles.includes(role.id)) {
                                let roleIndex = modRoles.indexOf(role.id);
                                modRoles.splice(roleIndex, 1);
                                args.config.saveValue("modRoles", modRoles);
                                return { text: `Removed **${role.name}** from the moderator roles.` };
                            } else {
                                return { text: "Role isn't in the list!" };
                            }
                        } else if (roleName == "") {
                            return { text: "Please specify a role to remove." };
                        } else notFound = true;
                    } else if (args.params[1] == "removeall") {
                        if (modRoles.length == 0) {
                            return { text: "Moderator roles list is empty!" };
                        } else {
                            return { text: "Removed all roles from the moderators role list." };
                        }
                    } else if (!notFound) {
                        return { text: "**Manage moderator roles**:\n `add`: Adds a role to the list.\n `remove`: Removes a role from the list.\n `removeall`: Removes all roles from the list." };
                    }
                    if (notFound) {
                        return { text: `Role **${roleName}** wasn't found!` };
                    }
                } else if (args.params[0] == "adminrole" || args.params[0] == "adminroles") {
                    let roleName = args.params.slice(2).join(" ");
                    let role = args.utils.roleFind(msg.guild, roleName);
                    let adminRoles = args.config.readValue("adminRoles");
                    let notFound = false;
                    if (args.params[1] == "add") {
                        if (role) {
                            if (adminRoles.includes(role.id)) {
                                return { text: "Role is already in the list!" };
                            } else {
                                adminRoles.push(role.id);
                                args.config.saveValue("adminRoles", adminRoles);
                                return { text: `Added **${role.name}** to the admin roles.` };
                            }
                        } else if (roleName == "") {
                            return { text: "Please specify a role to add." };
                        }
                        else notFound = true;
                    } else if (args.params[1] == "remove") {
                        if (role) {
                            if (adminRoles.includes(role.id)) {
                                let roleIndex = adminRoles.indexOf(role.id);
                                let memberRoles = msg.member.roles.filter(r=>r.permissions.has("ADMINISTRATOR") && r.id != role.id);
                                if (memberRoles.size != 0 || msg.author.id == msg.guild.ownerID) {
                                    adminRoles.splice(roleIndex, 1);
                                    args.config.saveValue("adminRoles", adminRoles);
                                    return { text: `Removed **${role.name}** from the admin roles.` };
                                } else return { text: "You cannot remove this role from the list." };
                            } else {
                                return { text: "Role isn't in the list!" };
                            }
                        } else if (roleName == "") {
                            return { text: "Please specify a role to remove." };
                        } else notFound = true;
                    } else if (!notFound) {
                        return { text: "**Manage admin roles (Can modify config)**:\n `add`: Adds a role to the list.\n `remove`: Removes a role from the list." };
                    }
                    if (notFound) {
                        return { text: `Role **${roleName}** wasn't found!` };
                    }
                } else if (args.params[0] == "list" || args.params[0] == "show") {
                    let adminRoles = args.config.readValue("adminRoles").map(r=>"**" + msg.guild.roles.get(r).name + "**");
                    let modRoles = args.config.readValue("modRoles").map(r=>"**" + msg.guild.roles.get(r).name + "**");
                    let prefix = args.prefix;
                    let isDefPref = args.config.readValue("prefix") == "";
                    return {
                        text: `**Current config**:\n *Prefix*: ${prefix} ${isDefPref ? "(Default)" : ""}\n *Admin Roles*: ${adminRoles.join(", ")}\n *Moderator Roles*: ${modRoles.join(", ")}\n *Blacklist*: Check the \`blacklist\` command.`
                    };
                } else if (args.params[0] == "prefix") {
                    let newPrefix = args.params[1];
                    let defPrefix = args.defaultConfig.getPrefix();
                    if (newPrefix == "reset" || newPrefix == defPrefix) {
                        args.config.saveValue("prefix", "");
                        return { text: `Resetted prefix to \`${defPrefix}\`.` };
                    } else if (newPrefix == "" || !newPrefix) {
                        return { text: "**Prefix Manager**: Select a new prefix for the bot or use `reset` to reset to the default prefix." };
                    } else {
                        args.config.saveValue("prefix", newPrefix);
                        return { text: `The bot's prefix has been changed to \`${newPrefix}\`.` };
                    }
                } else if (args.params.length == 0) {
                    return {
                        text: `**Config manager**:\n__Available options__:\n \`modrole\`: Manages moderator roles.\n \`adminrole\`: Manages admininstrator roles.\n \`prefix\`: Manages prefix for the current server.\n \`list\`: Lists current config.`
                    };
                } else {
                    return { text: "Invalid option." };
                }
            }
        }
    ],
    handle(eventType, args, Discord, Client, Config) {
        if (eventType == "guild_init") {
            let gDB = args.config;
            let guild = args.guild;
            confCheck(args.guild, gDB);
            let modRoles = gDB.readValue("modRoles");
            let adminRoles = gDB.readValue("adminRoles");
            if (!(Array.isArray(modRoles) && modRoles.length > 0)) {
                let roles = guild.roles.filter(r=> {
                    let name = r.name.toLowerCase();
                    return (name.includes("mods") || name.includes("moderator")) && r.members.filter(m=>!m.user.bot).size != 0;
                });
                if (roles.size != 0) {
                    gDB.saveValue("modRoles", roles.map(r=>r.id));
                }
            }
            if (!(Array.isArray(adminRoles) && adminRoles.length > 0)) {
                let roles = guild.roles.filter(r=>r.hasPermission("ADMINISTRATOR") && r.members.filter(m=>!m.user.bot).size != 0);
                if (roles.size != 0) {
                    gDB.saveValue("adminRoles", roles.map(r=>r.id));
                }
            }
        }
    }
}

function confCheck(guild, conf) {
    let changed = false;
    let val = conf.readValue("modRoles");
    let updated = false;
    let newVal = val;
    if (val && val.length != 0) {
        for (var i = 0; i < val.length; ++i) {
            let role = guild.roles.get(val[i]);
            if (!role) {
                changed = true;
                updated = true;
                newVal.splice(newVal.indexOf(val[i]), 1);
            }
        }
        if (updated) conf.saveValue("modRoles", newVal);
        updated = false;
    }
    val = conf.readValue("adminRoles");
    newVal = val;
    if (val && val.length != 0) {
        for (var i = 0; i < val.length; ++i) {
            let role = guild.roles.get(val[i]);
            if (!role) {
                changed = true;
                updated = true;
                newVal.splice(newVal.indexOf(val[i]), 1);
            }
        }
        if (updated) {
            conf.saveValue("adminRoles", newVal);
        }
    }
    return changed;
}