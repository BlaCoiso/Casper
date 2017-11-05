
// Module Docs___________________________
// | Type: MANAGER
// | Function: Manage anything related to config
// |_____________________________________

var configCache = {};
const JDB = require('node-json-db');
const fs = require('fs');
const ConfigGenerator = require("./configGenerator.js");
const HUMAN_READABLE_DB = false;
const AUTOSAVE = true;
const useRethonk = false; //unused
var DiscordClient = null;
var GuildDatabase = null;
var guildDBFile = "";
var botOptions = {};

/** @module */
module.exports = {
    /**
     * Initializes the config manager, internal function called on bot startup
     * @param {string} guildCfgFile
     * @param {Discord.Client} client
     * @param {Object} bot
     */
    init(guildCfgFile, client, bot) {
        guildDBFile = guildCfgFile;
        try {
            fs.accessSync(guildCfgFile, fs.constants.R_OK);
            try {
                fs.writeFileSync(guildCfgFile + ".bak", fs.readFileSync(guildCfgFile));
            } catch (e) {
                console.error(`[CfgBkp]: Failed to backup DB. ${e.message}`);
            }
        }
        catch (e) { }
        GuildDatabase = new JDBManager(guildDBFile);
        DiscordClient = client;
        botOptions = bot;
    },
    /**
     * Fetches a guild DB object
     * @param {Discord.Guild} guild
     * @returns {GuildDB}
     */
    fetchGuildDB(guild) {
        let cachedGuildConf = configCache[guild.id];
        if (!cachedGuildConf) {
            cachedGuildConf = new JDBGuildConfig(GuildDatabase, guild);
            guild.config = cachedGuildConf;
            configCache[guild.id] = cachedGuildConf;
        }
        return cachedGuildConf;
    },
    /**
     * Initializes a guild DB
     * @param {Discord.Guild} guild
     * @returns {boolean} - Guild DB up to date
     */
    guildConfigInit(guild) {
        let GuildDB = this.fetchGuildDB(guild);
        if (ConfigGenerator.checkUpdates(GuildDB, botOptions)) {
            GuildDatabase.setAutosave(false);
            ConfigGenerator.generateConfig(GuildDB, botOptions);
            GuildDatabase.setAutosave(true);
            console.info(`[Cfg]: Generated config for ${guild.id}.`);
            return true;
        } else {
            return false;
        }
    },
    /**
     * Returns the callback to generate config
     */
    getInitCallback() {
        return ConfigGenerator.registerModuleCfg;
    },
    /**
     * Returns an array of guild IDs that are no longer available but still have data in the DB
     * @returns {string[]} - Guild IDs
     */
    getDeadGuilds() {
        let guilds = [];
        let DBData = GuildDatabase.getData();
        for (let guild in DBData) {
            let gObj = DiscordClient.guilds.get(guild);
            if (!gObj) guilds.push(guild);
        }
        return guilds;
    }
}

function pathFromName(value) {
    let replacer = /\./g;
    let path = "/" + value.replace(replacer, "/");
    return path;
}

class JDBManager {
    constructor(filename) {
        this.DB = new JDB(filename, AUTOSAVE, HUMAN_READABLE_DB);
        if (!this.DB) throw new Error("Can't access DB file " + filename);
    }
    readPath(path) {
        return this.DB.getData(path);
    }
    getProperty(prop) {
        return this.DB.data[prop];
    }
    writePath(path, value) {
        return this.DB.push(path, value, true);
    }
    deletePath(path) {
        return this.DB.delete(path);
    }
    getData() {
        return this.DB.data;
    }
    setAutosave(save) {
        this.DB.saveOnPush = save;
        if (save) this.DB.save();
        return save;
    }
}

class GuildConfig {
    constructor(guild) {
        if (!guild) throw TypeError("Invalid guild object.");
        this.guild = guild;
        this.id = guild.id;
        this.ready = false;
    }
    readValue(path) {
        return null; //Read a value from a config path
    }
    saveValue(path, value) {
        return false; //Save value into the path
    }
    initValue(path, defValue) {
        return false; //Initialize the value with defValue if it's not initialized/invalid (false or null or undefined)
    }
    getData() {
        return {}; //Return all data in the config as an object
    }
    setAutosave(save) {
        return false; //Set DB autosave mode
    }
}

class JDBGuildConfig extends GuildConfig {
    constructor(DB, guild) {
        super(guild);
        this.DB = DB;
        this.internalPath = "";
        this.initDB();
    }
    initDB() {
        this.internalPath = `/${this.id}`;
        try {
            let GDB = this.DB.readPath(this.internalPath);
            this.ready = true;
        } catch (e) {
            this.DB.writePath(this.internalPath, {
                name: this.guild.name,
                prefix: "",
                lastUpdatedTS: Date.now(),
                generated: false,
                moduleData: {},
                version: -1
            });
        }
    }
    readValue(path) {
        let accessPath = this.internalPath + pathFromName(path);
        return this.DB.readPath(accessPath);
    }
    saveValue(path, value) {
        let accessPath = this.internalPath + pathFromName(path);
        return this.DB.writePath(accessPath, value);
    }
    initValue(path, defValue) {
        try {
            let value = this.readValue(path);
            return this.saveValue(path, value || defValue);
        } catch (e) {
            return this.saveValue(path, defValue);
        }
    }
    getData() {
        return this.DB.readPath(this.internalPath);
    }
}

/**
 * @classdesc Guild database object, constructor isn't accessable
 * @name GuildDB
 * @class
*/

/**
 * Reads a value from the DB
 * @method
 * @name GuildDB#readValue
 * @param {string} path - Database value path
 * @returns {(number|string|Object|number[]|string[]|Object[])} Value
*/

/**
 * Saves a value into the DB
 * @method
 * @name GuildDB#saveValue
 * @param {string} path - Database value path
 * @param {(number|string|Object|number[]|string[]|Object[])} value - Value to save
*/

/**
 * Initializes a DB value if it doesn't exist
 * @method
 * @name GuildDB#initValue
 * @param {string} path - Database value path
 * @param {(number|string|Object|number[]|string[]|Object[])} value - Value to initialize
*/

/**
 * Gets all data in the database
 * @method
 * @name GuildDB#getData
 * @returns {Object}
*/