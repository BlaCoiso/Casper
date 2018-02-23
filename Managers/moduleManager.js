
// Module Docs___________________________
// | Type: MANAGER
// | Function: Manage Modules and Handle Events
// |_____________________________________

let CasperModules = {};
let LoadedModules = [];
let commandTable = [];
let commandObjects = [];

const cmdNoDM = "This command is not available in direct messages.";
const cmdNoPerms = "You don't have permissions to run this command.";

const CasperUtils = require('./casperUtils.js');
let loggerClient = null;
var ConfigManager = null;
var handledEvents = 0;
var lastMessage;

/** @module */
module.exports = {
    /**
     * Initializes the module manager
     * @param {Discord} Discord
     * @param {Discord.Client} Client
     * @param {Object} Config
     * @param CfgManager
     */
    init(Discord, Client, Config, CfgManager) {
        ConfigManager = CfgManager;
        if (Config.getConfig().loggerWebhook) {
            let loginStuff = Config.getConfig().loggerWebhook;
            loggerClient = new Discord.WebhookClient(loginStuff[0], loginStuff[1]);
        }
    },
    /**
     * Logs an error into the webhook
     * @param {(Object|string)} err
     */
    errorLog(err) {
        logError(err);
    },
    /**
     * Loads the modules into the module cache, initializes them and registers commands
     * This is an internal function and shouldn't be used by commands
     * @param {string[]} moduleList
     * @param loadCallback
     */
    loadModules(moduleList, loadCallback) {
        LoadedModules = moduleList;
        for (let i = 0; i < LoadedModules.length; ++i) {
            const module = LoadedModules[i].toLowerCase();
            const modname = module[0].toUpperCase() + module.slice(1);
            const modpath = `../Modules/${module}.js`;
            delete require.cache[require.resolve(modpath)];
            let moduleObj = require(modpath);
            moduleObj.name = modname;
            CasperModules[modname] = moduleObj;
            if (moduleObj && moduleObj.handles("message")) {
                this.registerCommands(moduleObj);
            }
            if (moduleObj && loadCallback) loadCallback(moduleObj);
        }
        console.info(`[ModManager]: Loaded modules (${moduleList.join(", ")})`);
    },
    /**
     * Handles an event request, called by event modules
     * @param {string} eventType
     * @param {Object} eventArg
     * @param {Discord} Discord
     * @param {Discord.Client} client
     * @param {Object} conf
     */
    handle(eventType, eventArg, Discord, client, conf) {
        try {
            handledEvents++;
            switch (eventType) {
                case "message":
                    this.messageHandle(eventArg, Discord, client, conf);
                    break;
                default:
                    this.handleEvent(eventType, eventArg, Discord, client, conf);
            }
        } catch (e) {
            logError(`Error while handling ${eventType} event: ${e.message}`);
            console.error(`[ModManager]: Error while handling ${eventType} event:\n -> ${e.stack}`);
        }
    },
    /**
     * Handles an event and sets up some arguments
     * This is an internal function that shouldn't be called directly
     * @param {string} type
     * @param {Object} arg
     * @param {Discord} Discord
     * @param  {Discord.Client} client
     * @param {Object} conf
     */
    handleEvent(type, arg, Discord, client, conf) {
        try {
            if (!arg) arg = {};
            arg.casperUtils = CasperUtils;
            arg.errLogger = logError;
            arg.configManager = ConfigManager;
            for (let moduleName in CasperModules) {
                let module = CasperModules[moduleName];
                if (module && module.handle && module.handles(type)) {
                    //TODO: Make catch thing for each module handle call
                    if (module.needsConfig && arg.config) {
                        arg.moduleConfig = arg.config.readValue("moduleData")[moduleName];
                    }
                    if ((type == "message" && module.overridesMessage) || type != "message") {
                        module.handle(type, arg, Discord, client, conf);
                    }
                }
            }
        } catch (e) {
            logError(`Error while handling **${type}** event: **${e.name}** -> ${e.message}`);
            console.error(`Error while handling ${type} event: ${e.name}\n -> ${e.stack}`);
        }
    },
    /**
     * Reloads all modules
     */
    reloadModules() {
        CasperModules = {};
        commandObjects = [];
        commandTable = [];
        this.loadModules(LoadedModules, null);
    },

    // Message / Command related

    /**
     * Handles a Message event, internal function
     * @param {Discord.Message} message
     * @param {Discord} Discord
     * @param {Discord.Client} client
     * @param {Object} conf
     */
    messageHandle(message, Discord, client, conf) {
        try {
            let isDM = message.channel.type == "dm";
            const DB = (isDM ? null : ConfigManager.fetchGuildDB(message.guild));
            const DBObj = (DB ? DB.getData() : {});
            let prefix = (isDM ? conf.getPrefix() : (DBObj.prefix == "" ? conf.getPrefix() : DBObj.prefix));
            if (message.content.startsWith(prefix) && (DB ? !DB.readValue("blacklisted") : true)) {
                lastMessage = message.cleanContent;
                var channel = message.channel;
                let channelPerms = isDM ? null : message.channel.permissionsFor(message.guild.member(message.client.user));
                let respondPerms = (isDM ? 2 : (channelPerms.has("SEND_MESSAGES") ? (channelPerms.has("EMBED_LINKS") ? 2 : 1) : 0));
                let botPerms = isDM ? null : message.guild.member(message.client.user).permissions;
                if (message.content == prefix + "ping") {
                    channel.send("Pinging...").then(msg => {
                        msg.edit(`Pong! ${msg.createdTimestamp - message.createdTimestamp}ms`);
                    }).catch(logError);
                } else if (message.content == prefix + "help") {
                    if (message.channel.type != "dm") message.channel.send("Help has been sent to DMs.").catch(logError);
                    let msg = generateHelpMessage(prefix);
                    message.author.send(msg).catch(logError);
                } else {
                    let command = message.content.toLowerCase().split(' ')[0].slice(prefix.length);
                    let params = message.content.split(' ').slice(1);
                    let paramsJoined = params.join(" ");
                    let commandObj = this.findCommand(command);
                    let userPerms = [];
                    if (!isDM) userPerms = CasperUtils.checkPerms(message.author, DBObj, message.guild);
                    if (CasperUtils.checkDev(client, message.author, conf)) userPerms.push("dev");
                    let asyncCallback = obj => {
                        let messageOptions = obj.options || {};
                        if (obj) {
                            if (obj.reply) messageOptions.reply = message.author;
                            if (obj.embed && respondPerms == 2) {
                                messageOptions.embed = obj.embed;
                                return channel.send("", messageOptions).catch(logError);
                            }
                            else if (obj.text) {
                                return channel.send(obj.text, messageOptions).catch(logError);
                            }
                        }
                    };
                    let argObj = {
                        perms: userPerms, botPerms: botPerms, channelPerms: channelPerms, respondPerms: respondPerms, params: params, paramsJoined: paramsJoined, prefix: prefix,
                        command: command, message: message, isDM: isDM, channel: channel, configObject: DBObj,
                        defaultConfig: conf, config: DB, setModuleConfig: setModuleConf, embed: Discord.RichEmbed, Discord: Discord, moduleHandler: this,
                        cfgManager: ConfigManager, utils: CasperUtils, errLogger: logError, asyncCallback: asyncCallback, color: 15113758,
                        eventCount: handledEvents
                    };
                    if (commandObj) {
                        let modName = commandObj.module;
                        if (CasperModules[modName].needsConfig && DBObj && !isDM) {
                            let moduleConf = DBObj.moduleData[commandObj.module];
                            if (moduleConf) argObj.moduleConf = moduleConf;
                        }
                        this.handleCommand(commandObj, argObj);
                    } else {
                        this.handleEvent("message", argObj, Discord, client, conf);
                    }
                }
            }
        } catch (e) {
            console.error(`Error while processing message "${message.cleanContent}": \n${e.stack}`);
            logError(`**${e.name}** while processing message "${message.cleanContent}": \n${e.message}`);
        }
    },
    /**
     * Registers a Casper module's commands so they can be used
     * Internal function, shouldn't be called
     * @param {CasperModule} module
     */
    registerCommands(module) {
        let count = 0;
        if (module && module.handles("message") && module.commands) {
            for (let command of module.commands) {
                command.module = module.name;
                commandTable.push(command.name);
                commandObjects.push(command);
                if (command.aliases && typeof command.aliases != "string") {
                    for (let alias of command.aliases) {
                        commandTable.push(alias);
                        commandObjects.push(command);
                    }
                } else if (typeof command.aliases == "string") {
                    commandTable.push(command.aliases);
                    commandObjects.push(command);
                }
                count++;
            }
        }
        console.info(`[ModManager]: Registed ${count} command${count == 1 ? "" : "s"} from module ${module.name}.`);
    },
    /**
     * Finds a command object, returns null if not found
     * @param {string} cmd
     * @returns {CasperCommand}
     */
    findCommand(cmd) {
        let index = commandTable.indexOf(cmd);
        if (index != -1) {
            return commandObjects[index];
        } else {
            return null;
        }
    },
    /**
     * Handles a command, internal function called by {@link messageHandle}
     * @param {CasperCommand} commandObj
     * @param {CommandArgs} args
     */
    handleCommand(commandObj, args) {
        let userPerms = args.perms;
        let command = args.command;
        let respondPerms = args.respondPerms;
        let message = args.message;
        let channel = args.channel;
        let isDM = args.isDM;
        try {
            if (!commandObj.allowDM && isDM) {
                channel.send(cmdNoDM).catch(logError);
            } else {
                let hasPerms = true;
                if (commandObj.perms) {
                    if (typeof commandObj.perms == "string") hasPerms = userPerms.includes(commandObj.perms);
                    else if (Array.isArray(commandObj.perms) && commandObj.perms.length !== 0) {
                        hasPerms = false;
                        for (let permission of commandObj.perms) {
                            if (userPerms.includes(permission)) hasPerms = true;
                            break;
                        }
                    }
                }
                if (hasPerms) {
                    if (isDM || checkBlacklist(args.config.readValue("blacklist"), commandObj.name, commandObj.module, message.channel.id)) {
                        if (commandObj.requiresArgs && args.params.length == 0) {
                            args.asyncCallback({ text: `\`${args.prefix + args.command}\`: ${commandObj.description}\n${commandObj.usage ? ` **Usage**: \`${args.prefix + args.command} ${commandObj.usage}\`` : ""}` });
                        } else {
                            let res = commandObj.run(message, args);
                            if (res) args.asyncCallback(res);
                        }
                    }
                } else if (commandObj.noPermsMessage) {
                    message.reply(cmdNoPerms).catch(logError);
                }
            }
        } catch (e) {
            message.channel.send(`**${e.name}** on command **${command}** from module **${commandObj.module}**: ${e.message}`).catch(e => { console.error("An error occured while displaying the error: " + e.message) });
            console.error(`Error on command ${command}, module ${commandObj.module}:\n ${e.stack}`);
            logError(`**${e.name}** on command **${command}** from module **${commandObj.module}**: ${e.message}\n**Debug info**: paramsJoined = **|${args.paramsJoined}|**, channel = **|**${channel}**|**, userPerms = **|**${userPerms.join(", ")}**|**, triggered by **|**${message.cleanContent}**|**`);
        }
    }
}

/**
 * Logs an error into the webhook
 * @param {Object|string} err
 */
function logError(err) {
    if (loggerClient) {
        if (err) {
            if (typeof err == "string") {
                loggerClient.send(err);
            } else {
                loggerClient.send(`A(n) ${err.name} happened: ${err.message}\nLast message handled: ${lastMessage}`);
                console.error(`A ${err.name} happened: ${err.message}`)
            }
        } else {
            loggerClient.send("An unknown error happened.");
        }
    }
}

/**
 * 
 * @param {CasperDB} DB
 * @param {string} moduleName
 * @param {string} varName
 * @param value
 */
function setModuleConf(DB, moduleName, varName, value) {
    return DB.saveValue(`moduleData.${moduleName}.${varName}`, value);
}

/**
 * Generates the help message for all commands
 * @param {string} prefix
 * @returns {string}
 */
function generateHelpMessage(prefix) {
    let helpMessage = "**List of Casper Commands**:\n"; //TODO: Change this and make it not hardcoded
    for (let moduleName in CasperModules) {
        let module = CasperModules[moduleName];
        if (module && module.commands && module.commands.length != 0 && !module.commands[0].unlisted) {
            helpMessage += "**" + (module.fullName ? module.fullName : module.name) + " Commands**: \n";
            for (let cmd of module.commands) {
                if (!cmd.unlisted) {
                    helpMessage += ` \`${prefix + cmd.name}\`: ${cmd.description}\n`;
                }
            }
        }
    }
    return helpMessage;
}

/**
 * Checks if the command is allowed by the blacklist
 * @param {Object[]}
 * @param {string}
 * @param {string}
 * @param {string}
 * @returns {boolean}
 */
function checkBlacklist(blacklist, command, module, channel) {
    return true; //Blacklist not implemented yet
}

//JSDoc documentation

/**
 * Casper command object
 * @typedef CasperCommand
 * @type {Object}
 * @property {string} name - Command's name
 * @property {string} description - Command's description (used in help message)
 * @property {(string|string[])} perms - Required permissions for this command
 * @property {boolean} allowDM - Should this command work in DMs
 * @property {boolean} unlisted - Should this command be listed in help
 * @property {boolean} noPermsMessage - Display a message when permissions are missing
 * @property {(string|string[])} aliases - Alternative names for the command
 * @property {CommandCallback} run - Executed when command is used
*/

/**
 * Command's run callback, called when a command is used
 * @callback CommandCallback
 * @param {Discord.Message} msg
 * @param {CommandArgs} args
 * @returns {CommandOutput}
*/

/**
 * Command's output callback
 * @callback AsyncCallback
 * @param {CommandOutput}
 * @returns {Promise<Discord.Message>} result - Message sent with the output, see {@link https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=send|channel.send}
*/

/**
 * Output of a command
 * @typedef CommandOutput
 * @type {Object}
 * @property {Object|Discord.RichEmbed} embed - Command's embed output
 * @property {string} text - Command's output, used as fallback if no embed perms
 * @property {Object} options - Response options, see {@link https://discord.js.org/#/docs/main/stable/typedef/MessageOptions|MessageOptions}
*/

/**
 * Arguments received by a command
 * @typedef CommandArgs
 * @type {Object}
 * @property {string} command - Name used to call the command
 * @property {string[]} params - Arguments used to call the command
 * @property {string} paramsJoined - Command arguments joined into a string
 * @property {string} prefix - Bot's prefix
 * @property {Discord.Message} message - Message object, see {@link https://discord.js.org/#/docs/main/stable/class/Message|Message}
 * @property {Discord.TextChannel} channel - Channel to send the response, see {@link https://discord.js.org/#/docs/main/stable/class/TextChannel|TextChannel}
 * @property {string[]} perms - User permissions
 * @property {Discord.Permissions} botPerms - Permissions for the bot in current server, see {@link https://discord.js.org/#/docs/main/stable/class/Permissions|Permissions}
 * @property {Discord.Permissions} channelPerms - Permissions for the bot in the current channel
 * @property {number} respondPerms - Set to 2 if bot can use embeds, else set to 1
 * @property {boolean} isDM - If the command was called in DMs
 * @property {GuildDB} config - Guild config, unavailable in DMs
 * @property {Object} defaultConfig - Bot's config object
 * @property {Object} moduleConf - Module's config (if available and not on DMs)
 * @property {function} setModuleConfig - Used to write to the module config
 * @property {Object} configObject - Object with all guild's DB data
 * @property {module:configManager} cfgManager - Config manager module
 * @property {module:moduleManager} moduleHandler - Module manager/handler
 * @property {Discord} Discord - Discord object
 * @property {Discord.RichEmbed} embed - Short for {@link https://discord.js.org/#/docs/main/stable/class/RichEmbed|Discord.RichEmbed}
 * @property {AsyncCallback} asyncCallback - Callback for asynchronous command output
 * @property {module:casperUtils} utils - Useful functions
*/

/**
 * @typedef CasperModule
 * @type {Object}
 * @property {string} fullName - Full module name, used for help message
 * @property {function} handles - Returns array of events handled by this module
 * @property {boolean} needsConfig - Does this module use the config
 * @property {function} generateConfig - Called on config generation
 * @property {function} checkConfUpdates - Returns if the config should be updated
 * @property {function} handle - Handles an event, check {@link module:moduleManager.handle}
 * @property {CasperCommand[]} commands - Array of commands in this module
*/