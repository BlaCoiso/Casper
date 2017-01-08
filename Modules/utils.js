// Module Docs___________________________
// | Name: Utils
// | Type: MODULE
// | Function: Useful commands
// |_____________________________________

module.exports = {
    handler: function (message, command, params, config, data) {
        if (this.handles.indexOf(command) != -1) {
            if (command == "uinfo" || command == "userinfo" || command == "user") {
                this.userinfo(message, params, data.isDM);
            } else if ((command == "serverinfo" || command == "sinfo" || command == "server") && !data.isDM) {
                this.serverinfo(message);
            } else if (command == "yt" || command == "youtube" || command == "ytvideo" || command == "ytvid") {
                //this.yt(message, data, params, Youtube); //Youtube is defined where?? Also, fun.js
            } else if (command == "role" || command == "roleinfo" || command == "rinfo") {
                this.roleinfo(message, params, data);
            }
        }
    },
    handles: ["uinfo", "userinfo", "user", "serverinfo", "sinfo", "server", "yt", "youtube", "ytvideo", "ytvid", "role", "roleinfo", "rinfo"],
    helpMessage: "**Useful commands**:\n `userinfo`: Gives information about an user.\n `serverinfo`: Gives information about the server.\n" +
        " `roleinfo`: Gives information about a role.\n `youtube`: Searches for a youtube video (**Note: Currently unimplemented**)\n",
    userinfo: function (message, params, isDM) {
        var user = message.mentions.users.first() || message.author;
        var userGuild = (isDM ? null : message.guild.member(user));
        if (!isDM) {
            userGuild = message.guild.members.get(params[0]) || message.guild.members.find("nickname", params[0]) || userGuild;
            if (userGuild) user = userGuild.user;
        }
        var game = user.presence.game;
        var gameName = game ? game.name : "Nothing";
        var userRoles = (isDM ? null : userGuild.roles.array());
        if (!isDM) {
            userRoles.shift(); //takes @evryone
            for (var i = 0; i < userRoles.length; ++i) {
                userRoles[i] = userRoles[i].name;
            }
            userRoles = userRoles.join(", ");
        }
        var status = { dnd: "Do Not Disturb", offline: "Offline/Invisible", online: "Online", idle: "Idle" };
        message.channel.sendMessage(
			"Info for **" + user.username + "#" + user.discriminator + "** | (" + user.id +
			")\n -**Created in** " + user.createdAt + " \n" +
			(isDM ? "" : (" -**Joined in** " + userGuild.joinedAt + " \n")) +
			" -**User Status**: " + status[user.presence.status] + " \n" +
			" -**Playing**: " + gameName + " \n" +
            (isDM ? "" : (" -**Nickname**: " + (userGuild.nickname ? userGuild.nickname : "None") + "\n")) +
			(isDM ? "" : (" -**User roles**: " + (userRoles.length > 0 ? userRoles : "*user doesn't have any roles*") + "\n")) +
			(user.avatarURL ? (" -**User avatar**: " + user.avatarURL) : "")
			);
    },
    serverinfo: function (message) {
        var guild = message.guild;
        message.channel.sendMessage(
			"Info for **" + guild.name +
			"\n** - **Created**: " + guild.createdAt + "\n" +
			" - **ID**: " + guild.id + "\n" +
			" - **Region**: " + guild.region + "\n" +
			" - **Owner**: `" + guild.owner.user.username + "#" + guild.owner.user.discriminator + "`\n" +
			" - **Member Count**: " + guild.memberCount + "\n" +
			" - **Verification Level**: " + guild.verificationLevel + "\n" +
			(guild.iconURL ? (" - **Icon**: " + guild.iconURL) : "")
		);
    },
    yt: function (message, data, params, Youtube) {
        message.youtube.searchVideos("suc", 1) //message.youtube??
        .then(results => {
            message.channel.sendMessage(results[0].title);
        })
        .catch(console.log);
    },
    ping: function (message) {
        message.channel.sendMessage("Pinging...")
            .then(msg => {
                msg.edit("Pong! " + (msg.createdTimestamp - message.createdTimestamp) + "​ms​");
            }).catch(console.error);
    },
    roleinfo: function (message, params, data) {
        if (params.length == 0) {
            message.channel.sendMessage("`" + data.prefix + "roleinfo`: Gives info about a role. To select a role mention it, or give the name, ID, role position.");
        } else {
            var roleList = message.guild.roles;
            var roleParam = params.join(" ");
            var role = roleList.get(roleParam) || roleList.find("name", roleParam) || roleList.find("position", parseInt(roleParam)) || message.mentions.roles.first();
            if (role) {
                var memberList = "";
                if (role.members.size < 35) {
                    for (var i = 0; i < role.members.size; ++i) {
                        var member = role.members.array()[i];
                        memberList += "**" + member.user.username + "#" + member.user.discriminator + "**" + (i == role.members.size - 1 ? "" : ", ");
                    }
                }
                message.channel.sendMessage("Info for role **" + role.name + "**:\n-ID: " + role.id + "\n-Color: " + role.hexColor + "\n-Created at " + role.createdAt + "\n-Has Separate Category: " + role.hoist + "\n-Mentionable: " + role.mentionable + "\n-Role position: " + role.position + "\n\n-Members with role: " + (role.members.size < 35 ? (memberList) : "__Too many users have the role__. (**" + role.members.size + " users**)"));
            } else {
                message.channel.sendMessage("Can't find the role.");
            }
        }
    }
}