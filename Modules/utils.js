// Module Docs___________________________
// | Name: Utils
// | Type: MODULE
// | Function: Useful commands
// |_____________________________________

module.exports = {
    handler: function(message, command, params, config, data) {
        try {
            if (this.handles.indexOf(command) != -1) {
                if (command == "uinfo" || command == "userinfo" || command == "user") {
                    this.userinfo(message, params, data);
                } else if ((command == "serverinfo" || command == "sinfo" || command == "server") && !data.isDM) {
                    this.serverinfo(message, data);
                } else if (command == "yt" || command == "youtube" || command == "ytvideo" || command == "ytvid") {
                    //this.yt(message, data, params, Youtube); //Youtube is defined where?? Also, fun.js
                } else if (command == "role" || command == "roleinfo" || command == "rinfo") {
                    this.roleinfo(message, params, data);
                } else if (command == "avatar" || command == "icon" || command == "useravatar" || command == "usericon") {
                    this.avatar(message, params, data);
                }
            }
        } catch (e) {
            throw e;
        }
    },
    handles: ["uinfo", "userinfo", "user", "serverinfo", "sinfo", "server", "yt", "youtube", "ytvideo", "ytvid", "role", "roleinfo", "rinfo", "avatar", "icon", "useravatar", "usericon"],
    helpMessage: "**Useful commands**:\n `userinfo`: Gives information about an user.\n `serverinfo`: Gives information about the server.\n" +
        " `roleinfo`: Gives information about a role.\n `youtube`: Searches for a youtube video (**Note: Currently unimplemented**)\n `avatar`: Shows the user's avatar.\n",
    help: function(command) {
        var helpVal = [];
        switch (command) {
            case "uinfo":
            case "userinfo":
            case "user":
                helpVal = ["Gives information about an user. If the user isn't specified or not found, it will show info about your account.", "[user]"];
                break;
            case "serverinfo":
            case "sinfo":
            case "server":
                helpVal = ["Gives information about the current server.", ""];
                break;
            case "yt":
            case "youtube":
            case "ytvideo":
            case "ytvid":
                helpVal = ["Shows details of a random YouTube video matching the search.", "<search terms>"];
                break;
            case "role":
            case "roleinfo":
            case "rinfo":
                helpVal = ["Gives information about a role.", "<role>"];
                break;
            case "avatar":
            case "icon":
            case "usericon":
            case "useravatar":
                helpVal = ["Shows the user's avatar. If the user isn't specified or not found, it will show your account's avatar.", "[user]"];
                break;
            default:
                helpVal = null;
                break;
        }
        return helpVal;
    },
    userinfo: function(message, params, data) {
        try {
            var user = message.mentions.users.first() || ((params[0] && params[0] != "") ? data.userFind(data.client, message.guild, params.join(" ")) : null);
            var msg = "";
            if (params[0] && !user) {
                msg += "User wasn't found.\n";
                user = message.author;
            } else if (!user) {
                user = message.author;
            }
            var userGuild = (data.isDM ? null : message.guild.member(user));
            if (!data.isDM && !userGuild) msg += "Note: User isn't on this server.\n";
            var game = user.presence.game;
            var gameName = game ? game.name : "Nothing";
            var userRoles = (!userGuild ? null : userGuild.roles.array());
            if (userGuild) {
                userRoles.shift(); //takes @evryone
                for (var i = 0; i < userRoles.length; ++i) {
                    userRoles[i] = userRoles[i].name;
                }
                userRoles = userRoles.join(", ");
            }
            var status = {
                dnd: "Do Not Disturb",
                offline: "Offline/Invisible",
                online: "Online",
                idle: "Idle"
            };
            msg += "Info for **" + user.username + "#" + user.discriminator + "** | (" + user.id + ") " + (user.bot ? "**[BOT]**" : "") + "\n";
            msg += "\n -**Created in** " + translateDate(user.createdAt) + " (**" + checkDays(user.createdAt) + "**)\n"
            msg += (!userGuild ? "" : (" -**Joined in** " + translateDate(userGuild.joinedAt) + " (**" + checkDays(userGuild.joinedAt) + "**)\n"));
            msg += " -**User Status**: " + status[user.presence.status] + "\n";
            msg += " -**Playing**: " + gameName + "\n";
            msg += (!userGuild ? "" : (" -**Nickname**: " + (userGuild.nickname ? userGuild.nickname : "None") + "\n"));
            msg += (!userGuild ? "" : (" -**User roles**: " + (userRoles.length > 0 ? userRoles : "*user doesn't have any roles*") + "\n"));
            msg += (user.avatarURL ? (" -**User avatar**: " + user.avatarURL) : "");
            message.channel.sendMessage(msg);
        } catch (e) {
            throw e;
        }
    },
    serverinfo: function(message, data) {
        try {
            var verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻"];
            var region = {
                "brazil": "Brazil",
                "eu-central": "Central Europe",
                "singapore": "Singapore",
                "us-central": "U.S. Central",
                "sydney": "Sydney",
                "us-east": "U.S. East",
                "us-south": "U.S. South",
                "us-west": "U.S. West",
                "eu-west": "Western Europe",
                "vip-us-east": "VIP U.S. East",
                "london": "London"
            };
            var SinfoEmbed = new data.Discord.RichEmbed()
                .setAuthor(`${message.guild.name} | ${message.guild.id}`, message.guild.iconURL ? message.guild.iconURL : message.client.user.displayAvatarURL)
                .setThumbnail(message.guild.iconURL ? message.guild.iconURL : message.client.user.displayAvatarURL)
                .addField("Created", `${message.guild.createdAt.toString().substr(0, 15)},\n${checkDays(message.guild.createdAt)}`, true)
                .addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
                .addField("Region", region[message.guild.region], true)
                .addField("Members", message.guild.memberCount, true)
                .addField("Roles", message.guild.roles.size, true)
                .addField("Channels", message.guild.channels.size, true)
                .addField("Verification Level", verifLevels[message.guild.verificationLevel], true)
                .addField("Default Channel", message.guild.defaultChannel, true)
                .setColor(15113758);
            message.channel.sendEmbed(SinfoEmbed);
        } catch (e) {
            throw e;
        }
    },
    yt: function(message, data, params, Youtube) {
        message.youtube.searchVideos("suc", 1) //message.youtube??
            .then(results => {
                message.channel.sendMessage(results[0].title);
            })
            .catch(console.log);
    },
    ping: function(message) {
        try {
            message.channel.sendMessage("Pinging...")
                .then(msg => {
                    msg.edit("Pong! " + (msg.createdTimestamp - message.createdTimestamp) + "​ms​");
                }).catch(console.error);
        } catch (e) {
            throw e;
        }
    },
    roleinfo: function(message, params, data) {
        try {
            if (params.length == 0) {
                message.channel.sendMessage("`" + data.prefix + "roleinfo`: Gives info about a role. To select a role mention it, or give the name, ID, role position.");
            } else {
                var RinfoEmbed = new data.Discord.RichEmbed();
                var roleList = message.guild.roles;
                var roleParam = params.join(" ");
                var role = roleList.get(roleParam) || roleList.find("name", roleParam) || roleList.find("position", parseInt(roleParam)) || message.mentions.roles.first();
                if (role) {
                    var memberList = [];
                    if (role.members.size < 35) {
                        for (var member of role.members.values()) {
                            memberList.push("**" + member.user.username + "#" + member.user.discriminator + "**");
                        }
                    }
                    RinfoEmbed.setAuthor(`${role.name} | ${role.id}`, role.hexColor == "#000000" ? `http://www.beautycolorcode.com/8B99A4-80x80.png` : `http://www.beautycolorcode.com/${role.hexColor.replace("#", "")}-80x80.png`)
                        .setThumbnail(role.hexColor == "#000000" ? `http://www.beautycolorcode.com/8B99A4-80x80.png` : `http://www.beautycolorcode.com/${role.hexColor.replace("#", "")}-80x80.png`)
                        .addField("Created", `${role.createdAt.toString().substr(0, 15)},\n${checkDays(role.createdAt)}`, true)
                        .addField("Color", role.hexColor, true)
                        .addField("Separate?", role.hoist.toString().replace("true", "Yes").replace("false", "No"), true)
                        .addField("Mentionable?", role.mentionable.toString().replace("true", "Yes").replace("false", "No"), true)
                        .addField("Members with role", role.members.size < 35 ? (memberList.join(", ")) : `Too many users to display. (${role.members.size})` )
                        .setColor(15113758);
                    message.channel.sendEmbed(RinfoEmbed)
                    // message.channel.sendMessage("Info for role **" + role.name + "**:\n-ID: " + role.id + "\n-Color: " + role.hexColor + "\n-Created at " + translateDate(role.createdAt) + " (**" + checkDays(role.createdAt) + "**)\n-Has Separate Category: " + role.hoist + "\n-Mentionable: " + role.mentionable + "\n-Role position: " + role.position + "\n\n-Members with role: " + (role.members.size < 35 ? (memberList.join(", ")) : "__Too many users have the role__. (**" + role.members.size + " users**)"));
                } else {
                    message.channel.sendMessage("Can't find role.");
                }
            }
        } catch (e) {
            throw e;
        }
    },
    avatar: function(message, params, data) {
        try {
            var user = message.author;
            if (params[0] && params[0] != "") {
                user = message.mentions.users.first() || data.userFind(data.client, message.guild, params.join(" ")) || user;
            }
            message.channel.sendFile(user.displayAvatarURL, user.id + ".jpg");
        } catch (e) {
            throw e;
        }
    },
    testError: function() {
        try {
            throw new Error("Testing error handling");
        } catch (e) {
            throw e;
        }
    }
}

function translateDate(date) {
    const Months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const Days = ["Sat", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return Days[date.getUTCDay()] + ", " + date.getUTCDate() + " " + Months[date.getUTCMonth()] + " " + date.getUTCFullYear() + " at " + date.getUTCHours() + ":" + zeros(date.getUTCMinutes(), 2) + ":" + zeros(date.getUTCSeconds(), 2) + "." + zeros(date.getUTCMilliseconds(), 3);
}

function zeros(val, num) {
    while (val.toString().length < num) {
        val = "0" + val;
    }
    return val;
}

function checkDays(date) {
    var now = new Date();
    var diff = now.getTime() - date.getTime();
    var days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
}
