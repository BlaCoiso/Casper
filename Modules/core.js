
// Module Docs___________________________
// | Name: Core
// | Type: CASPER_MODULE
// | Function: Core Casper Commands
// |_____________________________________

module.exports = {
    handles(event) {
        return event == "message";
    },
    commands: [
        {
            name: "eval",
            description: "Evaluates code",
            perms: "dev",
            allowDM: true,
            run(message, args) {
                if (!args.defaultConfig.getConfig().testVersion) return { text: "This command isn't available in release versions." };
                let functionToEval = args.params.join(" ");
                console.log("User " + message.author.username + "#" + message.author.discriminator + " used eval: " + functionToEval);
                try {
                    var result = eval(functionToEval);
                    if (result && String(result).toLowerCase().includes(message.client.token.toLowerCase())) result = "Contains bot's token, censored.";
                    return { text: "```js\nInput:\n" + functionToEval + "\n\nOutput:\n" + String(result) + "```" };
                } catch (err) {
                    return { text: "```js\nInput:\n" + functionToEval + "\n\nError:\n" + err.message + "```" };
                }
            }
        },
        {
            name: "reload",
            description: "Reloads modules",
            perms: "dev",
            allowDM: true,
            run(message, args) {
                try {
                    args.moduleHandler.reloadModules();
                    return { text: "Reloaded all modules :thumbsup:", reply: true };
                } catch (e) {
                    args.errLogger(`**${e.name}** while reloading modules: ${e.message}`);
                    console.error(`${e.name} while reloading modules:\n ${e.stack}`)
                    return { text: "Failed to reload modules. Please check logs for details." };
                }
            }
        },
        {
            name: "invite",
            description: "Gives the bot's invite link.",
            allowDM: true,
            aliases: ["addbot", "invitebot"],
            run(msg, args) {
                let invite = msg.client.generateInvite(268823574).then(i=>args.asyncCallback({ text: `**Invite ${msg.client.user.username} to your server!** ${i}` }));
            }
        },
        {
            name: "stats",
            description: "Shows the bot's stats and info.",
            allowDM: true,
            aliases: ["info", "botstats", "botinfo"],
            run(msg, args) {
                let devServer = msg.client.guilds.get(args.defaultConfig.getConfig().dev_server);
                let devRole = devServer.roles.get(args.defaultConfig.getConfig().dev_role);
                let devs = devRole.members.map(m=>m.user.username + "#" + m.user.discriminator);
                let stats = new args.embed()
                    .setColor(15113758)
                    .setAuthor(msg.client.user.username + " Stats and Info", msg.client.user.avatarURL)
                    .addField("Prefix", args.prefix == args.defaultConfig.getConfig().prefix ?
                        args.prefix : `${args.prefix} (Default: **${args.defaultConfig.getConfig().prefix}**)`, true)
                    .addField("Library", `Discord.js ${args.Discord.version}`, true)
                    .addField("Node.js Version", process.version, true)
                    .addField("Memory Usage", Math.floor(process.memoryUsage().rss / 10485.76) / 100 + " MB", true)
                    .addField("Guilds", msg.client.guilds.size.toLocaleString(), true)
                    .addField("Users", msg.client.users.size.toLocaleString(), true)
                    .addField("Test Instance", args.defaultConfig.getConfig().testVersion ? "Yes" : "No", true)
                    .addField("Events Handled", args.eventCount + " events", true)
                    .addField("Developed by:", devs.join(", "), true)
                    .setThumbnail(msg.client.user.avatarURL)
                    .setFooter(`Bot Uptime: ${args.utils.getTime(process.uptime())}`);
                return { text: "No text fallback available for this command.", embed: stats };
            }
        },
        {
            name: "command",
            description: "Lists command details.",
            allowDM: true,
            aliases: ["cmd", "cmdshow"],
            run(msg, args) {
                if (args.params && args.params[0] && args.params[0] != "") {
                    let command = args.moduleHandler.findCommand(args.params[0]);
                    if (command) {
                        let cmdPerms = (command.perms ? (Array.isArray(command.perms) ? (command.perms.length == 0 ? "None" : command.perms.join(", ")) : command.perms) : "None");
                        let cmdDMs = command.allowDM ? "Yes" : "No";
                        let cmdReqPerms = command.noPermsMessage ? "Yes" : "No";
                        let cmdAliases = (command.aliases ? (Array.isArray(command.aliases) ? (command.aliases.length == 0 ? "None" : command.aliases.join(", ")) : command.aliases) : "None");
                        let cmdReqArgs = command.requiresArgs ? "Yes" : "No";
                        let embed = new args.embed()
                            .setTitle(command.name)
                            .setDescription(command.description)
                            .addField("Permissions required", cmdPerms)
                            .addField("Works on DMs", cmdDMs)
                            .addField("Requires args", cmdReqArgs)
                            .addField("Message when no permissions", cmdReqPerms)
                            .addField("Command aliases", cmdAliases)
                            .setColor(15113758);
                        let output = `**Command** ${command.name}:\n **Description**: ${command.description}\n **Permissions Required**: ${cmdPerms}\n **Works on DMs**: ${cmdDMs}\n **Requires Args**: ${cmdReqArgs}\n **Message when no permissions**: ${cmdReqPerms}\n **Aliases**: ${cmdAliases}`;
                        return { text: output, embed: embed };
                    } else {
                        return { text: "Command wasn't found." };
                    }
                } else {
                    return { text: `\`${args.prefix + args.command}\`: ${this.description}` };
                }
            }
        }
    ]
}