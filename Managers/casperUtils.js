
// Module Docs___________________________
// | Type: SUPERMANAGER
// | Function: Hold Bot Structure
// |_____________________________________

/** @module */
module.exports = {
    /**
     * Checks if the user has dev permissions
     * @param {Discord.Client} Client
     * @param {Discord.User} userObject
     * @param {Object} configObject
     * @returns {boolean}
     */
    checkDev(Client, userObject, configObject) {
        try {
            let allowed = false;
            let guild = Client.guilds.get(configObject.getConfig().dev_server);
            if (guild && guild.member(userObject)) allowed = guild.member(userObject).roles.has(configObject.getConfig().dev_role);
            return allowed;
        } catch (e) {
            console.error(`Can't check for dev: ${e.message}`);
        }
    },
    checkDevAsync(Client, userObject, configObject) {
        //TODO: Make this
    },
    /**
     * Checks if the user is a moderator in the guild
     * @param {Discord.User} userObj
     * @param {string[]} modRoles
     * @param {Discord.Guild} guildObj
     * @returns {boolean}
     */
    checkMod(userObj, modRoles, guildObj) {
        try {
            let isMod = false;
            if (modRoles && guildObj) {
                for (let role of modRoles) {
                    isMod = guildObj.member(userObj).roles.has(role) || isMod;
                }
            }
            return isMod;
        } catch (e) {
            console.error(`Can't check if is moderator: ${e.message}`);
        }
    },
    /**
     * Checks if the user has admin permissions
     * @param {Discord.User} userObj
     * @param {string[]} adminRoles
     * @param {Discord.Guild} guildObj
     * @returns {boolean}
     */
    checkAdmin(userObj, adminRoles, guildObj) {
        try {
            let isAdmin = false;
            let memberObj = guildObj.member(userObj);
            if (memberObj.permissions.has("ADMINISTRATOR")) {
                isAdmin = true;
            } else if (adminRoles) {
                for (let role of adminRoles) {
                    isAdmin = memberObj.roles.has(role) || isAdmin;
                }
            }
            return isAdmin;
        } catch (e) {
            console.error(`Can't check if is admin: ${e.message}`);
        }
    },
    /**
     * Checks all user permissions and returns it into an array
     * @param {Discord.User} userObj
     * @param {Object} config
     * @param {Discord.Guild} guildObj
     * @returns {string[]}
     */
    checkPerms(userObj, config, guildObj) {
        let adminRoles = config.adminRoles;
        let modRoles = config.modRoles;
        let modPerms = config.modPerms;

        let admin = this.checkAdmin(userObj, adminRoles, guildObj);
        let mod = admin || this.checkMod(userObj, modRoles, guildObj);
        let userMember = guildObj.member(userObj);
        let ban = (mod && modPerms.includes("ban")) || admin || userMember.permissions.has("BAN_MEMBERS");
        let kick = (mod && modPerms.includes("kick")) || admin || userMember.permissions.has("KICK_MEMBERS");
        let roles = (mod && modPerms.includes("roles")) || admin || userMember.permissions.has("MANAGE_ROLES_OR_PERMISSIONS");
        let messages = (mod && modPerms.includes("messages")) || admin || userMember.permissions.has("MANAGE_MESSAGES");
        let permList = [];
        if (admin) permList.push("admin");
        if (mod) permList.push("mod");
        if (ban) permList.push("ban");
        if (kick) permList.push("kick");
        if (roles) permList.push("roles");
        if (messages) permList.push("messages");
        return permList;
    },
    /**
     * Finds an user by username, tag or ID
     * @param {Discord.Client} client
     * @param {Discord.Guild} guild
     * @param {string} target
     * @returns {Discord.User}
     */
    userFind(client, guild, target) {
        let user;
        const userSp = target.split("#");
        if (!isNaN(parseInt(target))) client.fetchUser(target);
        if (guild) {
            const userMember = guild.members.find(userG => (userG.user ? ((userSp[0] && userSp[1] && userG.user.discriminator == userSp[1] && userG.user.username.toLowerCase() == userSp[0].toLowerCase()) || userG.user.discriminator == target || userG.user.username.toLowerCase() == target.toLowerCase()) : null) || (userG.nickname ? userG.nickname.toLowerCase() == target.toLowerCase() : null));
            if (userMember) user = userMember.user;
        }
        user = client.users.get(target) || user || client.users.find(user => (userSp[0] && userSp[1] && user.discriminator == userSp[1] && user.username.toLowerCase() == userSp[0].toLowerCase()) || user.username.toLowerCase() == target.toLowerCase());
        return user;
    },
    /**
     * Finds a role by ID, name or position
     * @param {Discord.Guild} guild
     * @param {string} check
     */
    roleFind(guild, check) {
        return guild.roles.get(check) || guild.roles.find(role => (role.name.toLowerCase() == check.toLowerCase() || role.position == parseInt(check)));
    },
    getUserRole(guild, check, client) {
        if (Array.isArray(check)) {
            let user = null;
            let role = null;
            let uI = -1;
            let uIE = -1;
            for (var i = 0; i < check.length; ++i) {//find the user
                var temp = null;
                for (var l = 1; l < check.length - i + 1; ++l) {
                    let name = check.slice(i, i + l).join(" ");
                    temp = this.userFind(client, guild, name) || temp;
                    if (temp) {
                        if (!guild.member(temp)) continue;
                        uI = i;
                        uIE = i + l;
                        user = temp;
                        break;
                    }
                }
                if (temp && user) break;
            }
            //Find the role
            var i = (uI == 0) ? uIE : 0;
            for (; i < check.length; ++i) {
                var temp = null;
                for (var l = 1; l < check.length - i + 1; ++l) {
                    let name = check.slice(i, i + l).join(" ");
                    temp = this.roleFind(guild, name) || temp;
                    if (temp) {
                        role = temp;
                        break;
                    }
                }
                if (temp) break;
            }
            return [user, role];
        }
        return null;
    },
    /**
     * Parses an array to join values with quotes
     * Turns ["\"something","else\""] into ["something else"]
     * @param {string[]} array
     * @returns {string[]}
    */
    parseQuotes(array) {
        if (!Array.isArray(array)) return array;
        var lastQ = -1;
        var newArray = [];
        for (var i = 0; i < array.length; ++i) {
            if (array[i].split("\"").length == 2) {
                if (lastQ != -1) {
                    newArray.push(array.slice(lastQ, i + 1).join(" ").replace(/"/g, ""));
                    lastQ = -1;
                }
                else lastQ = i;
            } else if (lastQ == -1) {
                newArray.push(array[i]);
            }
        }
        if (lastQ != -1) newArray = newArray.concat(array.slice(lastQ, array.length));
        return newArray;
        //TODO: Handle input like "something""somethingelse" or stuff"things" properly
        //intended output for example above: ["something","somethingelse"] and ["stuff","things"]
    },
    /**
     * Transforms time in seconds into a string with days, hours, minutes and seconds
     * @param {number} value
     * @returns {string}
     */
    getTime(value) {
        let roundedSecs = Math.floor(value);
        let secs = roundedSecs % 60;
        let mins = Math.floor(roundedSecs % 3600 / 60);
        let hours = Math.floor(roundedSecs % 86400 / 3600)
        let days = Math.floor(roundedSecs / 86400);
        return (days ? days + " day" + (days == 1 ? "" : "s") + ", " : "") + ((hours || days) ? hours + " hour" + (hours == 1 ? "" : "s") + ", " : "") + ((mins || hours || days) ? mins + " minute" + (mins == 1 ? "" : "s") + " and " : "") + secs + " second" + (secs == 1 ? "" : "s");
    },
    /**
     * Generates a date string from a date object
     * @param {Date} date
     * @returns {string}
     */
    translateDate(date) {
        const Months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return `${Days[date.getUTCDay()]}, ${date.getUTCDate()} ${Months[date.getUTCMonth()]} ${date.getUTCFullYear()} at ${date.getUTCHours()}:${zeros(date.getUTCMinutes(), 2)}:${zeros(date.getUTCSeconds(), 2)}.${zeros(date.getUTCMilliseconds(), 3)}`;
    },
    /**
     * Returns how many days ago a date is
     * @param {Date} date
     * @returns {string}
     */
    checkDays(date) {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / 86400000);
        if (days == 0) return this.getTime(diff / 1000) + " ago";
        return `${days + (days === 1 ? " day" : " days")} ago`;
    },
    /**
     * Translates a time string (00d00h00m00s) into the number of seconds
     * @param {string}
     * @returns {number}
    */
    parseTimeString(string) {
        const regex = /(\d+)((?:d)|(?:h)|(?:m)|(?:s?))/g;
        let match;
        let total = 0;
        const mult = { d: 86400, h: 3600, m: 60, s: 1 };
        while (match = regex.exec(string)) {
            let amount = parseInt(match[1]);
            let multiplier = match[2] ? mult[match[2]] : 1;
            total += amount * multiplier;
        }
        return total;
    },
    /**
     * Recursively transforms an object into a string
     * @param value
     * @param {number} maxIter - Maximum amount of iterations
     * @returns {string}
     */
    makeString(value, maxIter) {
        maxIter = typeof maxIter == "number" ? maxIter : 250;
        if (maxIter > 0) {
            if (typeof value == "string") {
                return `"${value}"`;
            } else if (typeof value == "boolean" || typeof value == "number") return value.toString();
            else if (typeof value == "object") {
                if (value == null) return String(value);
                else if (Array.isArray(value)) return `[${value.map(v => this.makeString(v, maxIter - 1)).join(", ")}]`;
                else {
                    var props = { names: [], values: [] };
                    for (var prop in value) {
                        props.names.push(prop);
                        props.values.push(this.makeString(value[prop], maxIter - 1));
                    }
                    var result = "{\n";
                    for (var i in props.names) {
                        result += `${props.names[i]}: ${props.values[i]}${i == props.names.length - 1 ? "" : ","} `;
                    }
                    result += "\n}"
                    return result;
                }
            } else if (typeof value == "function") {
                var str = value.toString();
                if (!str.startsWith("function")) str = "function " + str; //TODO: Support arrow functions
                return str;
            } else if (typeof value == "undefined") return "undefined";
            else {
                console.log(`Unknown Object ${typeof value}: ${value && value.constructor ? value.constructor.name : "?"}`);
                return String(value);
            }
        } else {
            return String(value); //Too many iterations
        }
    }
};

function zeros(val, num) {
    while (val.toString().length < num) {
        val = "0" + val;
    }
    return val;
}