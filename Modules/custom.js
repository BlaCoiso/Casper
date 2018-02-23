
// Module Docs___________________________
// | Name: Custom
// | Type: CASPER_MODULE
// | Function: Custom Command Module
// |_____________________________________

module.exports = {
    handles(event) {
        return event == "message";
    },
    fullName: "Custom Module",
    commands: [
        {
            name: "addcommand",
            description: "Adds a custom command.",
            usage: "<command> [contents]",
            aliases: ["addcmd", "addcom"],
            perms: "mod",
            noPermsMessage: true,
            run(msg, args) {
                if (args.params.length == 0) {
                    return { text: `\`${args.prefix + args.command}\`: ${this.description}\n**Available special options for custom command response**:\n \`{user}\`: Mentions the user\n \`{user.name}\`: Shows the user's current name\n \`{user.id}\`: Shows the user's ID\n \`{server}\`: Shows the server's name\n \`{server.id}\`: Shows the server's ID\n You can also use \`{0}\`, \`{1}\`, etc for arguments.` };
                } else {
                    let commandName = args.params[0].toLowerCase();
                    let customCmds = args.moduleConf.customCommands;
                    let customAliases = args.moduleConf.customAliases;
                    if (args.moduleHandler.findCommand(commandName)) {
                        return { text: "The command with the name you entered already exists!" };
                    } else if (findCustomCommand(commandName, customCmds)) {
                        return { text: "A custom command with this name already exists! If you meant to edit it, use `editcommand` instead." };
                    } else if (findCustomCommand(commandName, customAliases)) {
                        return { text: "A custom alias with this name already exists!" };
                    } else {
                        let command = {
                            name: commandName,
                            perms: [],
                            editPerms: [],
                            aliases: [],
                            out: ""
                        };
                        if (args.params[1] && args.params[1] != "") {
                            command.out = args.params.slice(1).join(" ");
                            customCmds.push(command);
                            args.setModuleConfig(args.config, "Custom", "customCommands", customCmds);
                            return { text: `A custom command with the name \`${commandName}\` has successfully been created! Use \`editcommand\` to modify it.` };
                        } else {
                            let filter = m => m.author.id == msg.author.id;
                            args.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ["time"] })
                                .then(c => {
                                    let cmdContent = c.first().content;
                                    command.out = cmdContent;
                                    customCmds.push(command);
                                    args.setModuleConfig(args.config, "Custom", "customCommands", customCmds);
                                    args.asyncCallback({ text: "Custom command successfully created." });
                                })
                                .catch(c => args.asyncCallback({ text: "User took too long to reply, command creation canceled." }));
                            return { text: `Creating command \`${commandName}\`... Please enter the command's content.` };
                        }
                    }
                }
            }
        },
        {
            name: "editcommand",
            perms: "mod",
            description: "Edits a custom command.",
            aliases: ["editcom", "editcmd"],
            noPermsMessage: true,
            run(msg, args) {
                if (args.params.length == 0) {
                    return { text: `\`${args.prefix + args.command}\`: ${this.description}` };
                } else {
                    let customCmds = args.moduleConf.customCommands;
                    let name = args.params[0].toLowerCase();
                    let command = findCustomCommand(name, customCmds);
                    if (command) {
                        let newOut = args.params.slice(1).join(" ");
                        if (newOut.split(" ").join("").length != 0) {
                            command.out = newOut;
                            args.setModuleConfig(args.config, "Custom", "customCommands", customCmds);
                            return { text: `Updated \`${name}\` custom command.` };
                        } else {
                            return { text: "Command response wasn't specified." };
                        }
                    } else {
                        return { text: "Custom command wasn't found." };
                    }
                }
            }
        },
        {
            name: "removecommand",
            aliases: ["removecmd", "remcommand", "remcmd", "delcommand", "deletecommand", "delcmd", "deletecmd"],
            perms: "mod",
            description: "Deletes a custom command.",
            usage: "<command>",
            noPermsMessage: true,
            requiresArgs: true,
            run(msg, args) {
                let customCmds = args.moduleConf.customCommands;
                let name = args.params[0].toLowerCase();
                let command = findCustomCommand(name, customCmds);
                if (command) {
                    customCmds.splice(customCmds.indexOf(command), 1);
                    args.setModuleConfig(args.config, "Custom", "customCommands", customCmds);
                    return { text: "Successfully deleted custom command." };
                } else {
                    return { text: "Can't find custom command to delete." };
                }
            }
        },
        {
            name: "listcommands",
            aliases: ["listcmds", "listcmd", "cmdlist"],
            description: "Lists custom commands.",
            run(msg, args) {
                let customCmds = args.moduleConf.customCommands;
                let cmdList = customCmds.map(c => c.name).join(", ");
                return { text: "Available Custom Commands: " + (customCmds.length === 0 ? "None" : cmdList) };
            }
        }
    ],
    needsConfig: true,
    confV: 2,
    generateConfig(oldConf, guild) {
        if (oldConf.version == 1 && oldConf.customCommands) {
            let names = [];
            let newCmdList = [];
            for (let cmd of oldConf.customCommands) {
                if (cmd && names.indexOf(cmd.name.toLowerCase()) !== 1) {
                    cmd.name = cmd.name.toLowerCase();
                    names.push(cmd.name);
                    newCmdList.push(cmd);
                }
            }
            oldConf.customCommands = newCmdList;
        }
        oldConf.customCommands = oldConf.customCommands || [];
        oldConf.customAliases = oldConf.customAliases || [];
        oldConf.version = this.confV;
        return oldConf;
    },
    checkConfUpdates(oldConfig) {
        return oldConfig.version != this.confV;
    },
    overridesMessage: true,
    handle(eventType, args, Discord, Client, Config) {
        if (eventType == "message") {
            let msg = args.message;
            if (!args.moduleConfig) {
                return;
            }
            let customCmds = args.moduleConfig.customCommands;
            let customAliases = args.moduleConfig.customAliases;
            let cmd = findCustomCommand(args.command, customCmds);
            let alias = findCustomCommand(args.command, customAliases);
            if (cmd) {
                let cmdOut = cmd.out;
                let cmdRegTest1 = /{(\D[\w\.]*)}/g;
                let cmdRegTest2 = /{(\d*)}/g;
                //TODO: Add escape stuff
                cmdOut = cmdOut.replace(cmdRegTest1, (total, match) => {
                    if (match == "user") {
                        return msg.member.toString();
                    } else if (match == "server") {
                        return msg.guild.name;
                    } else if (match == "user.name") {
                        return msg.member.displayName;
                    } else if (match == "user.tag") {
                        return msg.author.username + "#" + msg.author.discriminator;
                    } else if (match == "server.members") {
                        return msg.guild.members.size;
                    } else if (match == "user.id") {
                        return msg.author.id;
                    } else if (match == "server.id") {
                        return msg.guild.id;
                    } else if (match == "args") {
                        return args.paramsJoined;
                    } else {
                        return total;
                    }
                });
                cmdOut = cmdOut.replace(cmdRegTest2, (total, match) => args.params[parseInt(match)] || " ");
                args.asyncCallback({ text: cmdOut });
            }
            // Else check custom aliases
        }
    }
};

function findCustomCommand(cmd, list) {
    for (let command of list) {
        if (command.name == cmd) return command;
    }
    return null;
}

function findCustomAliasFor(name, list) {
    for (let alias of list) {
        if (alias.target == name) return alias;
    }
    return null;
} //Useless?