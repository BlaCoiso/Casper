var JDB = require('node-json-db');
var USR = require('../../Managers/usercheck.js')

// Module Docs___________________________
// | Name: Message Event
// | Type: MANAGER
// | Function: Load Configuration Files
// |_____________________________________

// Modules
var LoadedModules = ["fun", "links", "stats", "eval", "utils", "mod", "config"];
var CasperModules = {};
const cmdNoDM = "This command is not available in direct messages.";
loadModules();

module.exports = {
    enable: function (Discord, Client, Configuration) {
        Client.on('message', (message) => {
            try {
                if (!message.author.bot && message) {
                    // Database Instance of Guild Config
                    var isDM = message.channel.type == "dm";
                    var DB = new JDB((isDM ? `./Structure/Configuration/config` : `./Database/Guilds/${message.guild.id}-settings`), true, true);
                    let prefix = DB.getData("/prefix");
                    if (prefix == "") prefix = Configuration.getConfig().prefix;
                    if (message.content == Configuration.getConfig().prefix + "prefix" || message.content == prefix + "prefix") message.reply("Current prefix on this server is **" + prefix + "**");
                    if (message.content.startsWith(prefix) && !message.author.bot) {
                        let command = message.content.toLowerCase().split(' ')[0].slice(prefix.length);
                        let params = message.content.split(' ').slice(1);
                        let isBotDev = USR.checkDev(Client, message.author, Configuration);
                        var isMod = false;
                        var isAdmin = false;
                        var modPerms = [];
                        if (!isDM) {
                            isMod = USR.checkMod(Client, message.author, DB, message.guild);
                            isAdmin = USR.checkAdmin(Client, message.author, DB, message.guild) || message.member == message.guild.owner;
                            modPerms = USR.getModPerms(DB);
                        }
                        var messageCfg = { isDM: isDM, mod: isMod || isAdmin, admin: isAdmin, modPerms: modPerms, prefix: prefix, defPrefix: Configuration.getConfig().prefix, isDev: isBotDev, Discord: Discord, client: Client, userFind: USR.userFind, noDM: cmdNoDM, isTest: Configuration.getConfig().testVersion };
                        //TODO: Allow modules to be loaded/removed
                        // Generic
                        if (command == "ping") {
                            CasperModules.Utils.ping(message);
                        }
                        else if (command == "reload" && isBotDev) {
                            CasperModules = {};
                            loadModules();
                            message.reply("Reloaded modules :thumbsup:");
                        }
                        else if (command == "help" || command == "list" || command == "commandlist" || command == "commands") {
                            if (params.length == 0) {
                                var help = "**List of commands**: (*prefix is " + prefix + "*)\n `help`: Shows this message, use `" + prefix + "help [command name]` to get help for a specific command.\n" +
                                    " `ping`: Shows the bot latency.\n" +
                                    " `prefix`: Shows the current prefix.\n" +
                                    "**Dev commands**:\n `eval`: Evaluates code.\n" +
                                    " `reload`: Reloads all modules.\n";
                                for (var module in CasperModules) {
                                    if (LoadedModules.indexOf(module.toLowerCase()) != -1) {
                                        var mod = CasperModules[module];
                                        help += mod.helpMessage;
                                    }
                                }
                                help += "**Note**: Some commands have alternate names.";
                                message.author.sendMessage(help);
                                message.channel.sendMessage("Help has been sent to DMs.");
                            } else {
                                var help = null;
                                for (var module in CasperModules) {
                                    if (LoadedModules.indexOf(module.toLowerCase()) != -1) {
                                        var mod = CasperModules[module];
                                        if (mod.handles.indexOf(params[0]) != -1 && mod.help) {
                                            help = mod.help(params[0]);
                                            if (help) {
                                                message.channel.sendMessage("`" + prefix + params[0] + "`: " + help[0] + "\nUsage: `" + prefix + params[0] + " " + help[1] + "`");
                                            }
                                        }
                                    }
                                }
                                if (!help) {
                                    message.channel.sendMessage("Command not found.");
                                }
                            }
                        }
                        else {
                            for (var module in CasperModules) {
                                if (LoadedModules.indexOf(module.toLowerCase()) != -1) {
                                    var mod = CasperModules[module];
                                    if (mod.handles.indexOf(command) != -1) {
                                        try {
                                            mod.handler(message, command, params, DB, messageCfg);
                                        } catch (e) {
                                            message.channel.sendMessage("**" + e.name + "** on command **" + command + "** from module **" + module + "**: " + e.message);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                message.channel.sendMessage("Error while processing command \"" + message + "\": " + e.message);
            }
        });
    }
}

function loadModules() {
    for (var i = 0; i < LoadedModules.length; ++i) {
        var module = LoadedModules[i].toLowerCase();
        var modname = module[0].toUpperCase() + module.slice(1);
        var modpath = "../../Modules/" + module + ".js";
        delete require.cache[require.resolve(modpath)];
        CasperModules[modname] = require(modpath);
    }
}