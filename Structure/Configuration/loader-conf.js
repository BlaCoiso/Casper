const config = require('./config.json');

// Module Docs___________________________
// | Type: MANAGER
// | Function: Load Configuration Files
// |_____________________________________

module.exports = {

    getConfig: function () {
        return config;
    },

    getPrefix: function () {
        return config.prefix;
    }

}