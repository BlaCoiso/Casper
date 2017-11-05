const config = require('./config.json');

// Module Docs___________________________
// | Type: MANAGER
// | Function: Load Configuration Files
// |_____________________________________

module.exports = {

    getConfig() {
        return config;
    },

    getPrefix() {
        return config.prefix;
    },

    getModules() {
        return config.modules;
    }

};